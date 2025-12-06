from django.urls import path
from .views import (
    GoodsListView, GoodsCreateView, GoodsDetailView,
    GoodsUpdateView, GoodsDeleteView, MyGoodsView, CreateOrderView, ProducerOrderView, ProducerOrderDetailView,
    MyOrdersView, CreateOrderView, create_flutterwave_qr, flutterwave_callback, flutterwave_webhook, MyOrderDetailView, get_payment_by_order,
    get_customer_qr_payments, payment_status
)

urlpatterns = [
    path('', GoodsListView.as_view(), name='goods-list'),
    path('create/', GoodsCreateView.as_view(), name='goods-create'),
    path('me/', MyGoodsView.as_view(), name='my-goods'),
    path('<int:pk>/', GoodsDetailView.as_view(), name='goods-detail'),
    path('<int:pk>/update/', GoodsUpdateView.as_view(), name='goods-update'),
    path('<int:pk>/delete/', GoodsDeleteView.as_view(), name='goods-delete'),
    path('create/order/', CreateOrderView.as_view(), name='order_create'),
    path('producer/order/', ProducerOrderView.as_view(), name='producer_order'),
    path('producer/order/<int:pk>/', ProducerOrderDetailView.as_view(), name='producer_order_detail'),
    path('customer/order/', MyOrdersView.as_view(), name='customer_order'),
    path("customer/order/<int:pk>/", MyOrderDetailView.as_view(), name="order-detail"),
    path('create/order/', CreateOrderView.as_view(), name='order-create'),
    path("payments/create-qr/<int:order_id>/", create_flutterwave_qr, name="create_qr_payment"),
    path("payments/flutterwave/webhook/", flutterwave_webhook, name="flutter_webhook"),
    path("payments/flutterwave/callback/", flutterwave_callback, name="flutter_callback"),
    path("customers/payments/", get_customer_qr_payments),
    path("payments/<int:order_id>/", get_payment_by_order, name="get-payment"),
    path('payments/status/<int:reference>/', payment_status, name='payment-status'),
]
