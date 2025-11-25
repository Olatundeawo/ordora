from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Goods, Order
from .serializers import GoodsSerializer, OrderSerializer
from rest_framework.permissions import AllowAny


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
        return Order.objects.filter(product_producer=self.request.user)

class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).order_by("-created_at")