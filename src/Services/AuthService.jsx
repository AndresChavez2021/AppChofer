import axios from "../Util/ConfigAxios.jsx";
import { Platform } from "react-native";
import { setItemAsync, deleteItemAsync } from "expo-secure-store";
import { USER_TOKEN_KEY, USER_KEY } from "../Providers/AuthProviders.jsx";

import errorHandler from "../Util/AxiosErrorHandler.jsx";
import { showToast } from "../Components/funciones.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* FUNCION PARA INICIAR SESION CON DATOS DE LA API */
export async function login(data) {
    try {
        data.device_name = Platform.OS;
        /* peticion a la API */
        let res = await axios.post("login", data);

        // console.log("DESDE LOGIN FUNCTION "+ JSON.stringify(res.data.data.cliente));
        await setItemAsync(USER_TOKEN_KEY, res.data.data.token);
        await setItemAsync(USER_KEY, JSON.stringify(res.data.data.conductor));// respuesta del server

        return res.data;
    } catch (e) {
        console.log("desde login", e);
        throw errorHandler(e);
    }

}
/* function para crear la cuenta */
export async function signup1(data) {
    // console.log(data);
    try {
        // console.log("entrando");
        let res = await axios.post("signup", data);
        console.log("CREANDO ", res)
        return res.data.message;
    } catch (e) {
        console.log(e);
        throw errorHandler(e);

    }

}

/* ELIMINA EL TOKEN DE USUARIO AL CERRAR SESION */
export async function logout() {
    try {
        let res = await axios.post("logout");
        await deleteItemAsync(USER_TOKEN_KEY);
        await deleteItemAsync(USER_KEY);
        await AsyncStorage.removeItem("id_equipo");
        return res.data;
    } catch (e) {
        throw errorHandler(e);
    }

}

//TODO FUNCIONES 

export async function listaEmpleados() {
    try {
        const resp = await axios.get("/listaEmpleados");
        // console.log("BACK EMPLEADOS ",resp.data.data);
        return resp.data.data;
    } catch (e) {
        throw errorHandler(e);
    }
}

export async function listarCamiones() {
    try {
        const resp = await axios.get("/listarCamiones");
        // console.log("BACK CAMIONES ",resp.data);
        return resp.data;
    } catch (e) {
        throw errorHandler(e);
    }
}


export async function registrarEquipo(data1) {
    try {
        const resp = await axios.post("/registrarEquipoDeRecorrido", data1);
        const { data, status } = resp.data;
        const obtenerIdEquipo = data.id;
        console.log("registrar camion", obtenerIdEquipo, status);

        if (status === "Success") {
            await AsyncStorage.setItem("id_equipo", JSON.stringify(obtenerIdEquipo));
            return "ok";
        } else {
            showToast("Ups.. hubo un error intenta nuevamente", "#e74c3c");
        }

    } catch (error) {
        throw errorHandler(error);
    }
}


export async function listaRutas() {

    try {
        const resp = await axios.get("/listarRutas");
        // console.log("back rutas", resp.data.data);
        return resp.data.data;
    } catch (error) {
        throw errorHandler(error);
    }

}

export async function obtenerCoordenadaDeLaRuta(id_ruta) {
    try {
        const resp = await axios.post("/obtenerCoordenadaDeLaRuta", { id_ruta: id_ruta });
        // console.log("COORD de id_ruta ", resp.data.data, id_ruta)

        return resp.data.data;

    } catch (error) {
        throw errorHandler(error);
    }

}

export async function guardarRecorridoDelChofer(data) {
    let id_equipo = await AsyncStorage.getItem('id_equipo');
    try {
        const resp = await axios.post("guardarRecorridoDelChofer", { ...data, id_equipoRecorrido: id_equipo });
        console.log("resp BACK REC",resp.data);
        return resp.data;
    } catch (error) {
        throw errorHandler(error);
    }
}


export async function obtenerBarrios(){
    try {
        const resp = await axios.get("/listaBarrios");
        // console.log("back obtenerBarrios", resp.data.data.barrios);
        return resp.data.data.barrios;
    } catch (error) {
        throw errorHandler(error);
    }
}


export async function sendNotifications(id_barrio){
    try {
        const resp = await axios.post("/sendNotifications", /* { id_barrio: id_barrio } */);
        console.log("resp BACK REC",resp.data);
       
    } catch (error) {
        console.log("resp BACK REC",error.message);
        throw errorHandler(error);
    }
}





