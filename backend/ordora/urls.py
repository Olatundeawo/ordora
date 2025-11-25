from django.urls import path
from .views import (
    GoodsListView, GoodsCreateView, GoodsDetailView,
    GoodsUpdateView, GoodsDeleteView, MyGoodsView, CreateOrderView, ProducerOrderView, 
    MyOrdersView, CreateOrderView,
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
    path('customer/order/', MyOrdersView.as_view(), name='customer_order'),
    path('create/order/', CreateOrderView.as_view(), name='order-create'),
]
