import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import ListaDeEmpleados from "../../Components/Chofer/ListaDeEmpleados";
import ListaDeCamiones from "../../Components/Chofer/ListaDeCamiones";
import { logout, registrarEquipo } from "../../Services/AuthService";

import { useRoute } from '@react-navigation/native'

const Inicio = ({ navigation }) => {
 
  const route = useRoute();
 
  const {empleado,camion}=route.params ? route.params : {};
  
  console.log("--DEVUELTA ----",route);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [obtenerCamion, setObtenerCamion] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  

  // console.log("setEmpleadosSeleccionadosINICIO", empleadosSeleccionados);
  console.log("obtenerCamion", obtenerCamion);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: "#00b894",
            padding: 8,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={() => {
            setEmpleadosSeleccionados([]);
            setObtenerCamion(null);
          }}>
          <Text style={{ color: "#fff" }}>Reasignar</Text>
        </TouchableOpacity>
      ),
     
    });
  }, []);


  useEffect(() => {
    (async () => {
      if (obtenerCamion) {
        setIsLoading(true);
        let data = {
          id_empleado: empleadosSeleccionados,
          id_camion: obtenerCamion,
        };
      
          const resp = await registrarEquipo(data);
          if (resp === "ok") {
            navigation.navigate("Rutas");
          }
          console.log("enviando REG ", data);

       
        
      }
    })();
  }, [obtenerCamion]);

  useEffect(() => {
     if(empleado || route.params!==undefined){
      setEmpleadosSeleccionados([]);
      setObtenerCamion(null);
      console.log("reiniciando desde el mapa  ",route.params);
     }
  }, [route.params])
  


  return (
    <>
      {empleadosSeleccionados && empleadosSeleccionados.length > 0

        ? (
          <ListaDeCamiones  navigation={navigation} setObtenerCamion={setObtenerCamion} />
        ) :

          (
            <View style={{ flex: 1, marginTop: -40 }}>
              <ListaDeEmpleados
              navigation={navigation}
                setEmpleadosSeleccionados={setEmpleadosSeleccionados}
              />
            </View>
          )}
    </>
  );
};

export default Inicio;

const styles = StyleSheet.create({});
