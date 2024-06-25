
import React from 'react'
import { Icon,Input,Text } from 'react-native-elements'
import { Controller } from 'react-hook-form'
const PasswordInput = ({placeholder,name,control,errors,inputStyle,errValiStyle,secureEntry,toggleSecureEntry}) => {
  return (
    <>
    <Controller
    control={control}
    rules={{
        required:true,
        minLength:6,
        maxLength:20,
        
    }}
    
    render={({field:{onChange,onBlur,value}})=>(
        <Input
        placeholder={placeholder}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        style={inputStyle}
        // placeholderTextColor="#6d6861"
        leftIcon={
            <Icon name="key" type='ionicon' size={24} color="#00b894" />
        }
        rightIcon={
          <Icon name="eye" type='ionicon' size={24} color="#00b894" onPress={toggleSecureEntry} />
      }
      secureTextEntry={secureEntry}
        />

    )}
    name={name}
   
    />
    {errors[name] ?.type ==="required" && <Text style={errValiStyle}>Campo requerido</Text>}
    {errors[name] ?.type ==="minLength" && <Text style={errValiStyle}>Contraseña demasiada corta</Text>}
    {errors[name] ?.type ==="maxLength" && <Text style={errValiStyle}>Contraseña demasiada larga</Text>}
    
    </>
  );
}

export default PasswordInput

