import { Stack } from 'expo-router'
import React from 'react'

export default function Authlayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name='login' options={{ title: "Login"}} />
      <Stack.Screen name='register' options={{ title: 'Register'}} />
    </Stack>
  )
}
