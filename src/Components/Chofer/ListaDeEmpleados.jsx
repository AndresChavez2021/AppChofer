
import { listaEmpleados } from '../../Services/AuthService'
import React, { Component, useState, useEffect, useLayoutEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  FlatList,
  RefreshControl
} from 'react-native'
import { Button, CheckBox } from 'react-native-elements';
import { showToast } from '../funciones';

const ListaDeEmpleados = ({ navigation, setEmpleadosSeleccionados }) => {
  const [obtenerEmpleado, setObtenerEmpleado] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const toggleCheckBox = (item) => {
    const updatedItems = [...checkedItems];
    const foundItem = updatedItems.find((checkedItem) => checkedItem.id === item.id);
    if (foundItem) {
      foundItem.isChecked = !foundItem.isChecked;
    } else {
      updatedItems.push({ id: item.id, isChecked: true });
    }
    setCheckedItems(updatedItems);
  };

  console.log("seleccionados ", checkedItems)
  async function listarEmpleados() {
    try {
      const listEmpleado = await listaEmpleados();
      const empleadosConChecked = listEmpleado.map((empleado) => ({ ...empleado, isChecked: false }));
      setObtenerEmpleado(empleadosConChecked);
      // console.log("FRONT ", empleadosConChecked);
    } catch (error) {
      console.log("ERR FRON ", error);
    }
  }



  const onbtenerEmpleadosSeleccionados = () => {


    const checkboxesSeleccionados = checkedItems
      .filter((item) => item.isChecked)
      .map((item) => item.id);
    // Hacer la solicitud HTTP a la API con los IDs de los checkboxes seleccionados
    if (checkboxesSeleccionados.length > 0) {
      setEmpleadosSeleccionados(checkboxesSeleccionados);

    } else {
      showToast("Por favor elige al menos un empleado", "#ff7f50")
    }
    console.log('IDs de checkboxes', checkboxesSeleccionados);


  };



  useEffect(() => {
    listarEmpleados()
  }, [])


  useLayoutEffect(() => {
    navigation.setOptions({
      
      headerTitle: () => (
        <View style={{textAlign:"center",alignSelf:"center",padding:8 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#00b894"}}>Empleados</Text>
        </View>
      ),
    });
  }, [navigation]);

  //Actualiza la lista de los empleados
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const listEmpleados = await listaEmpleados();
      showToast("Cargando...", "#2ecc71")
      const empleadosConChecked = listEmpleados.map((empleado) => ({ ...empleado, isChecked: false }));
      setObtenerEmpleado(empleadosConChecked);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };


  return (
    <View style={[styles.container]}>

      <FlatList
        style={styles.notificationList}
        data={obtenerEmpleado}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={item => {
          return item.id
        }}
        renderItem={({ item }) => {
          return (
            <>
              <View style={{ alignSelf: "flex-end", top: 35, zIndex: 170, right: 10 }}>
                {item.roles.map(item => (
                  <Text key={item.id} style={{ color: "#fff" }}>{item.name}</Text>
                ))}

              </View>

              <TouchableOpacity
                style={[styles.card, { borderColor: "#00b894" }]}
              >

                <View style={styles.cardContent}>



                  <Image style={[styles.image, styles.imageContent]} source={{ uri: item.image }} />

                  <Text style={styles.name}>{item.name} {item.apellidos}</Text>
                  <CheckBox
                    checked={checkedItems.find((checkedItem) => checkedItem.id === item.id)?.isChecked}
                    onPress={() => toggleCheckBox(item)}
                  />


                </View>

                <View style={[styles.tagsContent, { left: 15 }]}>
                  <Text>CI: {item.ci}</Text>
                  <Text>Celular: {item.phone}</Text>

                </View>

              </TouchableOpacity>

            </>
          )
        }}
      />
      {checkedItems && checkedItems.length > 0 ?
        (
          <View style={{ alignSelf: "center", width: "80%", bottom: 10 }}>
            <Button
              title="Guardar Equipo"
              onPress={onbtenerEmpleadosSeleccionados}
              buttonStyle={{ backgroundColor: "#00b894" }}
            />

          </View>

        )
        : null}
    </View>
  )
}

export default ListaDeEmpleados

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // backgroundColor: '#EBEBEB',
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255,0.7)"

  },
  formContent: {
    flexDirection: 'row',
    marginTop: 20,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBtnSearch: {
    alignSelf: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  card: {
    bottom: 10,

    height: null,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopWidth: 40,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,

  },
  cardContent: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  imageContent: {
    marginTop: -40,
  },
  tagsContent: {
    marginTop: 10,
    // flexWrap: 'nowrap',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center',
  },
  btnColor: {
    padding: 10,
    borderRadius: 40,
    marginHorizontal: 3,
    backgroundColor: '#eee',
    marginTop: 5,
  },
})