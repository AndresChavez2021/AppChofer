
import React from 'react'
import { Icon,Input,Text } from 'react-native-elements'
import { Controller } from 'react-hook-form'
const EmailInput = ({name,control,errors,inputStyle,errValiStyle,placeholder}) => {
  return (
    <>
    <Controller
    control={control}
    rules={{
        required:true,
        pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }}
    name={name}
    render={({field:{onChange,onBlur,value}})=>(
        <Input
        placeholder={placeholder}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        style={inputStyle}
        // placeholderTextColor="#95afc0"
        leftIcon={
            <Icon name="at" type='ionicon' size={24} color="#00b894" />
        }
        keyboardType="email-address"
        />

    )}
    />
    {errors[name] ?.type ==="required" && <Text style={errValiStyle}>Campo requerido</Text>}
    {errors[name] ?.type ==="pattern" && <Text style={errValiStyle}>El formato del correo no es valido</Text>}
    
    </>
  )
}

export default EmailInput

