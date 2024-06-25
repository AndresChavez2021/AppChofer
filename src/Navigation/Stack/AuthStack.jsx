
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../../Screen/Auth/Login';

const AuthStacks=createNativeStackNavigator();

export default function AuthStack() {
  return (
    <AuthStacks.Navigator screenOptions={{headerShown:false}}>
        <AuthStacks.Screen name='Login' component={Login}/>
    
    
    </AuthStacks.Navigator>
   
  )
}