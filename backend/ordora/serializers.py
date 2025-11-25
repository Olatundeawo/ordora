from rest_framework import serializers
from .models import Goods
from .models import Order, OrderItem

class GoodsSerializer(serializers.ModelSerializer):
    producer = serializers.ReadOnlyField(source='producer.id')

    class Meta:
        model = Goods
        fields = "__all__"

    def create(self, validated_data):
        user = self.context['request'].user
        return Goods.objects.create(producer=user, **validated_data)
    

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]


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
            quantity = item["quantity"]
            

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                
            )

            total += product.price * quantity

        order.total_price = total
        order.save()

        return order