import React,{useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './Stack/AuthStack';
import ChoferStack from './Stack/ChoferStack';


export default function Wrapper({userToken}){
  return (
    <NavigationContainer>
      <AppNavigation userToken={userToken}/>
    </NavigationContainer>
  );
}

const AppNavigation = ({userToken}) => {


  return (
    <>
       {userToken==null ?  <AuthStack/> : <ChoferStack/>}
    </>
  )
}


