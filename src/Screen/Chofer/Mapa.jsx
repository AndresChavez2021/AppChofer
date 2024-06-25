//// funciona repite la notificacion
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import MapView, { Marker } from "react-native-maps";
import { obtenerFechaHoraActual, obtenerHoraActual, showToast } from '../../Components/funciones';
import * as Location from "expo-location";
import { guardarRecorridoDelChofer, obtenerCoordenadaDeLaRuta, sendNotifications } from '../../Services/AuthService';
import TrazarRuta from '../../Components/Chofer/Mapa/TrazarRuta';
import io from "socket.io-client";

import { getDistance } from 'geolib';


const Mapa = ({ route, navigation }) => {
  const { id_ruta, dataRuta, barrios } = route.params;
  const { origen, destino } = dataRuta;
 
  
  const [CoordRuta, setCoordRuta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordenadasAcumuladas, setCoordenadasAcumuladas] = useState([]);
  const [horaInicio, setHoraInicio] = useState(obtenerHoraActual);
  const [datosDeLaRuta, setdatosDeLaRuta] = useState(dataRuta);
  const [coordOrigen, setCoordOrigen] = useState(null)
  const [CoorDestino, setCoorDestino] = useState(null)
  const [CoorBarrios, setCoorBarrios] = useState([])
  const [Scanning, setScanning] = useState(false)
  const [idBarrioCercano, setIdBarrioCercano] = useState(null)
  const radioCoordenadas = barrios;
  const radioDistancia = 400// en metros
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const socketRef = useRef(null);
  const [Coord, setCoord] = useState(null)
  const [ultimaNotificacionEnviada, setUltimaNotificacionEnviada] = useState(false);

  //TODO: OBTENER COORDENADA Y TRAZAR
  useEffect(() => {
    obtenerCoordenadasApi();
    inicializarSocket();
    // Map para extraer las propiedades de coordenada
    const coordenadasArray = barrios.map(coordenada => {
     const coordenadaObj = JSON.parse(coordenada.coordenada);
     const { lat, lng } = coordenadaObj[0];
     return { id: coordenada.id, lat, lng };
   });

   setCoorBarrios(coordenadasArray);

    /* if (!socketRef.current) {
      socketRef.current = io('http://192.168.100.211:3002/');
      // console.log('SOCKET', socketRef.current);
    }
 */
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    
  }, []);

  const inicializarSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io('https://socket-smart-trunck-5vimgyhx4a-uc.a.run.app/');
    }

    socketRef.current.on('cliente', data => {
      console.log("Datos del cliente:", data);
    });
  };

  
  // console.log("coordenadasArray ", coordenadasArray);
  // console.log("CoorBarrios ", CoorBarrios)

  async function obtenerCoordenadasApi() {
    try {
      const obtenerCoord = await obtenerCoordenadaDeLaRuta(id_ruta);
      // console.log("resp COORD FRONT", obtenerCoord);
      const coordenadas = JSON.parse(obtenerCoord[0].coordenadas);


      const convertirCoord = coordenadas.map(coordenada => ({
        latitude: coordenada.lat,
        longitude: coordenada.lng,
      }));

      setCoordRuta(convertirCoord);


      //TODO: CARGANDO ORIGEN Y DESTINO  DEL MAPA Y DE LA RUTA
      let coordOrigen = JSON.parse(origen);
      let coordDestino = JSON.parse(destino);
      console.log("**GET **", coordOrigen.lat);

      setCoordOrigen({
        latitude: coordOrigen.lat,
        longitude: coordOrigen.lng,
        latitudeDelta: 0.9995,
        longitudeDelta: 0.9995,
      });

      setCoorDestino({
        latitude: coordDestino.lat,
        longitude: coordDestino.lng,
      });


      setIsLoading(true);


    } catch (error) {
      console.log("obtener coord api ",error);
    }

  }



  //TODO: OBTENER UBICACION 
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Se requieren permisos de ubicación');
        return;
      }
    })()
  }, [])

/*   useEffect(() => {
    (async () => {
      if (idBarrioCercano !== null) {
        console.log("ENVIANDO NOITFI")
        await sendNotifications(idBarrioCercano)
        showToast('¡Enviando notificación!', '#3498db');

        socketRef.current.emit("isActive",true)

        socketRef.current.on("isActive",(data)=>{
          console.log("ON ACIVE ",data);
        }) 

      }

    })()
  }, [idBarrioCercano]) */

/*  */

  async function terminarRecorrdoYEnviar() {


    try {
      let data = {
        fechaHora: obtenerFechaHoraActual(),
        horaIni: horaInicio,
        horaFin: obtenerHoraActual(),
        coordenadas: coordenadasAcumuladas,
        id_ruta: id_ruta
      }
      const resp = await guardarRecorridoDelChofer(data);
      const { status } = resp;
      console.log("front ", resp)
      if (status === "Success") {
        navigation.navigate('Inicio', { empleado: [], camion: [] });
        showToast("Se registró correctamente", "#2ecc71");
        console.log("ENVIA ", status)
      }
    } catch (error) {
      console.log("terminar y enviar ",error)
    }
  }

  useEffect(() => {
   
    
    socketRef.current.on('cliente',data=>{
      setCoord(data);
      console.log("ON DATA CLIente",data)
    });
   
  }, [])
  

  useEffect(() => {
    const obtenerUbicacion = async () => {
      setScanning(true)
      try {
        const { coords } = await Location.getCurrentPositionAsync();
        const nuevaCoordenada = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setUbicacionActual(nuevaCoordenada);
        console.log("nuevaCoordenada", nuevaCoordenada)
     
       

        // Verificar si la ubicación actual está dentro del radio
        socketRef.current.emit('Chofer',nuevaCoordenada);
        // let idBarrio = isInRadio(nuevaCoordenada, Coord)
        // console.log("is RADIO", idBarrio)
        const distance = getDistance(nuevaCoordenada, Coord);
        //  isInRadio(nuevaCoordenada,CoorBarrios);
        // console.log("idBarrio",idBarrioCercano)
        if (distance <= 50 && !ultimaNotificacionEnviada) {
          await sendNotifications()
          setUltimaNotificacionEnviada(true);
          showToast('¡Enviando notificación!', '#3498db');
        } else {
          console.log(" NO ---EN RADIO ")
        }
       /*  if (isInRadio(nuevaCoordenada, Coord)) {

          console.log("emitiendo ")
         

        } */


      } catch (error) {
        console.log("efect de obtener ubicacion ",error);
      }
    };

    const interval = setInterval(obtenerUbicacion, 10000);

    setScanning(false)
    return () => {
      clearInterval(interval);
    };
  }, [Scanning,ultimaNotificacionEnviada]);

  
/*   const isInRadio = (coordenada, radioCoordenadas) => {
      console.log("CLIEBTE COORD RADIO ",radioCoordenadas)
    for (const radioCoordenada of radioCoordenadas) {
      console.log("IS RADIO ",{latitude:radioCoordenada.lat,longitude:radioCoordenada.lng})
      const distancia = getDistance(coordenada,{latitude:radioCoordenada.lat,longitude:radioCoordenada.lng});
      console.log("IS RADIO distancia ",distancia, radioCoordenada.id)
      if (distancia <= radioDistancia) {
        console.log("COORD IDS ", radioCoordenada.id)
        setIdBarrioCercano(radioCoordenada.id);
        console.log("radio radioDistancia", radioDistancia)
        return;
      }

    }
  

  }; */
  const calcularDistancia = (coordenada1, coordenada2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = toRad(coordenada2.lat - coordenada1.latitude);
    const dLon = toRad(coordenada2.lng - coordenada1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coordenada1.latitude)) *
      Math.cos(toRad(coordenada2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    return distancia;
  };

  const toRad = (grados) => {
    return (grados * Math.PI) / 180;
  };



  const mapRef = useRef();



  return (



    <View style={styles.container} >
      {
        isLoading ? (<>
          <MapView
            ref={mapRef}
            provider={"google"}
            userLocationPriority="high"
            zoomEnabled={true}
            zoomTapEnabled={true}
            loadingEnabled={true}
            /*   zoomControlEnabled={true} */
            style={StyleSheet.absoluteFill}
            initialRegion={coordOrigen}
            showsUserLocation={true}
            toolbarEnabled={false}
            showsMyLocationButton={true}
            userLocationFastestInterval={3000}
            maxZoomLevel={20}
            minZoomLevel={15}
            mapPadding={{ top: 405 }}>
            {isLoading ?
              <>
                <TrazarRuta coord={CoordRuta} />

                <Marker
                  title='Origen'
                  coordinate={coordOrigen}
                  image={require('../../Assets/image/markerOrigen.png')}
                />

                <Marker
                  title='Destino'
                  coordinate={CoorDestino}
                  image={require('../../Assets/image/markerDestino.png')}
                />

              </>

              : null}



          </MapView>

          <View style={styles.cardContainer}>
            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <Text style={styles.fieldText}>Ruta: </Text>
              </View>
              <View style={styles.cardField}>
                <Text style={styles.fieldText}>{datosDeLaRuta.nombreRuta} </Text>
              </View>

            </View>
            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <Text style={styles.fieldText}>Horario:</Text>
              </View>
              <View style={styles.cardField}>
                <Text style={styles.fieldText}>{datosDeLaRuta.hora_inicio} - {datosDeLaRuta.hora_fin}</Text>
              </View>


            </View>
          </View>



          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => terminarRecorrdoYEnviar()}>
              <Text style={styles.buttonText}>Terminar</Text>
            </TouchableOpacity>
          </View>
        </>
        ) : null}
    </View >




  )
}

export default Mapa

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 255, 255,1.0)',
    borderRadius: 13,
    padding: 16,
    elevation: 4,
    zIndex: 999, // Ajustar el valor según sea necesario
  },

  cardRow: {
    flexDirection: 'column',
  },
  cardField: {

    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#f00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
})