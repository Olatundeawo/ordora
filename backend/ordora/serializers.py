from rest_framework import serializers
from .models import Goods
from .models import Order, OrderItem, Payment, ProducerWallet

class GoodsSerializer(serializers.ModelSerializer):
    producer = serializers.ReadOnlyField(source='producer.id')

    class Meta:
        model = Goods
        fields = "__all__"

    def create(self, validated_data):
        user = self.context['request'].user
        return Goods.objects.create(producer=user, **validated_data)
    

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["product_name", "product_price","product", "quality"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ["id", "customer", "total_price", "status", "created_at", "items"]
        read_only_fields = ["id", "customer", "total_price", "status", "created_at"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        customer = self.context["request"].user

        order = Order.objects.create(customer=customer)

        total = 0

        for item in items_data:
            product = item["product"]
            quality = item["quality"]
            

            OrderItem.objects.create(
                order=order,
                product=product,
                quality=quality,
                
            )

            total += product.price * quality

        order.total_price = total
        order.save()

        return order


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "reference", "amount", "status", "qr_code", "created_at"]
        read_only_fields = ["id", "order", "reference", "status", "qr_code", "created_at"]


class ProducerWalletSerializer(serializers.ModelSerializer):
    producer_name = serializers.ReadOnlyField(source="producer.username")

    class Meta:
        model = ProducerWallet
        fields = ["producer", "producer_name", "balance"]
