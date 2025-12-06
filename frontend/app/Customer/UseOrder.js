
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert, } from "react-native"

export default function UseOrder() {
    const URL = process.env.EXPO_PUBLIC_BASE_URL
     const createOrder = async (productId, quantity) => {
         try {
            const access = await AsyncStorage.getItem("access")
            const response = await fetch(`${URL}goods/create/order/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                },
                body: JSON.stringify({
                    product: productId,
                    quality: quality
                })
            })

            if(!response.ok) {
                Alert.alert("Order not placed")
                return;
            }

            const result = response.json()
            console.log(result)
            Alert.alert("Order succesfully placed")
            return result
            
        } catch (e) {
            console.log(e)
        }
     }
  return { createOrder }
}
