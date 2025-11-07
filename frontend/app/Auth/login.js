import { React, useState, useEffect, use } from 'react'
import { View, Text } from 'react-native'
import { Link } from 'expo-router'

function login() {
  const [data, setData] = useState('')

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://192.168.43.235:8000/api/auth/register/", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log('result:', result);
        setData(result);
  
      } catch (error) {
        console.error('Network or fetch error:', error);
      }
    };
  
    getUser();
  }, []);
  

  return (
    <View>
        <Text>
            This is the login page
        </Text>
        <Link href="Auth/register">
        Clikc to register.
        </Link>
        {data ? (<Text>{data}</Text>):(<Text>No data avaliable</Text>)}
    </View>
  )
}

export default login