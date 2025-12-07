from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import requests
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Goods, Order, Payment, ProducerWallet
from .serializers import GoodsSerializer, OrderSerializer, PaymentSerializer, ProducerWalletSerializer
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.utils import timezone



class GoodsListView(generics.ListAPIView):
    queryset = Goods.objects.all()
    serializer_class = GoodsSerializer
    permission_classes = [AllowAny]


class GoodsCreateView(generics.CreateAPIView):
    serializer_class = GoodsSerializer
    permission_classes = [permissions.IsAuthenticated]


class GoodsDetailView(generics.RetrieveAPIView):
    queryset = Goods.objects.all()
    serializer_class = GoodsSerializer


class GoodsUpdateView(generics.UpdateAPIView):
    queryset = Goods.objects.all()
    serializer_class = GoodsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user != self.get_object().producer:
            raise PermissionDenied("You can only update your own goods.")
        serializer.save()


class GoodsDeleteView(generics.DestroyAPIView):
    queryset = Goods.objects.all()
    serializer_class = GoodsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user != instance.producer:
            raise PermissionDenied("You can delete only goods you created.")
        instance.delete()


class MyGoodsView(generics.ListAPIView):
    serializer_class = GoodsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(f"User accessing MyGoodsView: {user.name} ({user.email} {user.role})")  # <-- print the user

        if getattr(user, "role", None) != "producer":
            print("User is not a producer. Returning empty queryset.")
            return Goods.objects.none()
        
        print("User is a producer. Returning their goods.")
        return Goods.objects.filter(producer=user)


class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)


class ProducerOrderView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(items__product__producer=self.request.user).distinct()

class MyOrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

class ProducerOrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(items__product__producer=self.request.user).distinct()

@api_view(["POST"])
def create_flutterwave_qr(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    tx_ref = f"order-{order.id}-{int(order.created_at.timestamp())}"

    payload = {
        "tx_ref": tx_ref,
        "amount": float(order.total_price),
        "currency": "NGN",
        "payment_options": "card,bank,ussd",
        "redirect_url": "https://acroteral-vernon-unsnaffled.ngrok-free.dev/api/goods/payments/flutterwave/callback/",
        "customer": {"email": order.customer.email},
        "meta": {"order_id": order.id}
    }

    headers = {
        "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    resp = requests.post(
        "https://api.flutterwave.com/v3/payments",
        json=payload,
        headers=headers,
        timeout=15
    )

    data = resp.json()
    print("INITIAL PAYMENT RESPONSE:", data)

    if data.get("status") != "success":
        return Response({"error": "Flutterwave init failed", "detail": data}, status=400)

    hosted_link = data["data"]["link"]

    # Save payment record
    payment = Payment.objects.create(
        order=order,
        reference=tx_ref,
        amount=order.total_price,
        qr_code=hosted_link,
        status="pending"
    )

    return Response(PaymentSerializer(payment).data)


@csrf_exempt
def flutterwave_webhook(request):
    signature = request.headers.get("verif-hash")
    if not settings.DEBUG:
        if signature != settings.FLUTTERWAVE_WEBHOOK_SECRET:
            return JsonResponse({"error": "Invalid signature"}, status=401)

    payload = json.loads(request.body.decode("utf-8"))
    print("WEBHOOK RECEIVED:", payload)

    event = payload.get("event")
    data = payload.get("data", {})

    if event != "charge.completed":
        return JsonResponse({"status": "ignored"}, status=200)

    status = data.get("status")
    tx_ref = data.get("tx_ref")

    # retrieve order id
    order_id = data.get("meta", {}).get("order_id")

    # fallback for bank_transfer or channels where meta is missing
    if not order_id:
        try:
            order_id = tx_ref.split("-")[1]
        except:
            return JsonResponse({"error": "Order ID missing"}, status=400)

    if status != "successful":
        return JsonResponse({"status": "ignored"}, status=200)

    try:
        order = Order.objects.get(id=order_id)
        payment = Payment.objects.get(reference=tx_ref)
    except:
        return JsonResponse({"error": "Order/payment missing"}, status=404)

    payment.status = "paid"
    payment.paid_at = timezone.now()
    payment.save()

    order.status = "PAID"
    order.save()

    for item in order.items.all():
        item.product.quality -= item.quality
        item.product.save()
        # wallet, _ = ProducerWallet.objects.get_or_create(
        #     producer=item.producer
        # )
        # wallet.balance += payment.amount
        # wallet.save()

    return JsonResponse({"status": "success"}, status=200)




@api_view(["GET"])
@permission_classes([AllowAny])
def flutterwave_callback(request):
    """
    Optional: Redirect after payment
    """
    tx_ref = request.GET.get("tx_ref")
    status = request.GET.get("status")
    return JsonResponse({"tx_ref": tx_ref, "status": status})



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_customer_qr_payments(request):
    payments = Payment.objects.filter(
        order__customer=request.user
    ).order_by("-created_at")

    return Response(PaymentSerializer(payments, many=True).data)




@api_view(["GET"])
def get_payment_by_order(request, order_id):
    try:
        payment = Payment.objects.get(order_id=order_id)
    except Payment.DoesNotExist:
        return Response({"error": "QR Payment not found"}, status=404)

    serializer = PaymentSerializer(payment)
    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_status(request, reference):

    try:
        payment = Payment.objects.get(reference=reference)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)

    # Call Flutterwave
    url = f"https://api.flutterwave.com/v3/transactions?tx_ref={reference}"
    headers = {"Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"}

    r = requests.get(url, headers=headers)
    data = r.json()

    if data.get("status") == "success" and data["data"]:
        flw_status = data["data"][0]["status"]  # successful | failed | pending

        payment.status = flw_status
        payment.save()

        payment.order.status = "PAID" if flw_status == "successful" else "PENDING"
        payment.order.save()

        return Response({
            "status": flw_status,
            "reference": reference
        })

    return Response({"status": "pending"})
