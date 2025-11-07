import { React, useState, useEffect } from 'react'
import {View, Text} from 'react-native'
import { Link } from 'expo-router'

export default function register() {
 
  return (
    <View>
        <Text>
            This is the Register page.
        </Text>
        <Link href='Auth/login'>
        Login page
        </Link>
    </View>
  )
}
