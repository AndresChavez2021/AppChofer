import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl, FlatList, Image, TouchableOpacity } from 'react-native';
import { listarCamiones } from '../../Services/AuthService';
import { Button, CheckBox } from 'react-native-elements';
import { showToast } from '../funciones';

const ListaDeCamiones = ({navigation, setObtenerCamion }) => {

  const [listCamiones, setlistCamiones] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const [checkedItem, setCheckedItem] = useState(null);

  const toggleCheckBox = (item) => {
    if (checkedItem === item.id) {
      // Si el mismo checkbox está seleccionado, deseleccionarlo
      setCheckedItem(null);
    } else {
      // Si se selecciona un nuevo checkbox, deseleccionar el anterior y seleccionar el nuevo
      setCheckedItem(item.id);
    }
  };

  console.log("checkedItem ", checkedItem)


  const handleSearch = (text) => {
    setSearchText(text);
  }


  async function listarCamniones() {
    try {
      const listCamiones = await listarCamiones();
      setlistCamiones(listCamiones);
      // console.log("front CAMIONES ", listCamiones);

    } catch (error) {
      console.log(error)
    }

  }



  const obtenerCamion = () => {
    if (checkedItem) {
      setObtenerCamion(checkedItem);

    } else {
      showToast("Por favor elige un camion", "#ff7f50")
    }
    console.log("enviando Camion");
  }

  useEffect(() => {
    listarCamniones();
  }, [])


  //Actualiza la lista de los CAMIONES
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const listCamiones = await listarCamiones();
      setlistCamiones(listCamiones);
      showToast("Cargando...", "#2ecc71")
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{textAlign:"center",alignSelf:"center",padding:8 }}>
          <Text style={{fontSize:22,fontWeight:"700",color:"#00b894"}}>Camiones</Text>
        </View>
      ),
    });
  }, [navigation]);


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{uri:item.image}} style={styles.image} />
      <View style={[styles.cardBody]}>
        <Text style={styles.nombreVehiculo}>{item.nombre}</Text>
        <Text style={styles.placa}>{item.placa}</Text>
        <Text style={styles.carga}>Capacidad de carga: {item.capacidad_carga}</Text>
        <View style={{ alignSelf: "center", marginVertical: -15 }}>
          <CheckBox
            checked={checkedItem === item.id}
            onPress={() => toggleCheckBox(item)}
          />

        </View>
      </View>
      <View style={[styles.cardFooter, { alignSelf: "center" }]}>
        <Text style={styles.textFooter}>{item.capacidad_personal} personas</Text>

      </View>
    </TouchableOpacity>
  );

 

  return (
    <View style={styles.container}>
     
      <FlatList
        contentContainerStyle={styles.propertyListContainer}
        data={listCamiones}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={{ alignSelf: "center", width: "80%", bottom: 10 }}>

        {checkedItem ? (

          <Button
            title="Enviar"
            onPress={() => obtenerCamion()}
            buttonStyle={{ backgroundColor: "#00b894" }}

          />
        ) : null

        }

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 3,
  },
  searchInputContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  propertyListContainer: {
    paddingHorizontal: 20,
    backgroundColor:"#fff",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  image: {
    top: 10,
    height: 100,
    width: 170,
    alignSelf: "center",
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardBody: {
    marginBottom: 10,
    padding: 10,
  },
  nombreVehiculo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  placa: {
    fontSize: 16,
    marginBottom: 5
  },
  carga: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666'
  },
  cardFooter: {
    padding: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    justifyContent: 'space-between',
  },
  textFooter: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: 'bold'
  },
  baths: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: 'bold'
  },
  parking: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: 'bold'
  }
});

export default ListaDeCamiones