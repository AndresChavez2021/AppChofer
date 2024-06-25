
import React from 'react'
import { Icon,Input,Text } from 'react-native-elements'
import { Controller } from 'react-hook-form'
const TextInput = ({name,required=true,minLength,maxLength,control,errors,inputStyle,errValiStyle,iconName,placeholder}) => {
  return (
    <>
    <Controller
    control={control}
    rules={{
        required,
        minLength,
        maxLength,        
    }}
    
    render={({field:{onChange,onBlur,value}})=>(
        <Input
        placeholder={placeholder}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        style={inputStyle}
        // placeholderTextColor="black"
        leftIcon={
            <Icon name={iconName} type='ionicon' size={24} color="#9b59b6" />
        }
       
        />

    )}
    name={name}
    />
    {errors[name] ?.type ==="required" && <Text style={errValiStyle}>Campo requerido</Text>}
    {errors[name] ?.type ==="minLength" && <Text style={errValiStyle}>Longitud demasiada corta</Text>}
    {errors[name] ?.type ==="maxLength" && <Text style={errValiStyle}>Longitud demasiada larga</Text>}
    
    </>
  );
}

export default TextInput

