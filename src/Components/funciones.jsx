import Toast from "react-native-root-toast";

export const showToast = (titulo, bgColor) => {
    Toast.show(titulo, {
        duration: Toast.durations.SHORT,
        position: 70,
        backgroundColor: bgColor,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
    });
};

export const obtenerHoraActual = () => {
    // Obtener la fecha y hora actual
    let fechaHoraActual = new Date();
  
    // Obtener la hora en formato de 24 horas (ejemplo: 14:30)
    let hora = fechaHoraActual.getHours();
    let minutos = fechaHoraActual.getMinutes();
    let segundos = fechaHoraActual.getSeconds();
  
    // Formatear los minutos y segundos para asegurar que siempre tengan dos dígitos
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;
  
    // Concatenar la hora en formato HH:MM:SS
    let horaActual = `${hora}:${minutos}:${segundos}`;
  
    return horaActual;
  };


  //FUNCION QUE DEVUELVE LA FECHA EN EL FORMATO 2023-06-27
export const obtenerFechaHoraActual = () => {
    // Obtener la fecha y hora actual
    let fechaHoraActual = new Date();
  
    // Configurar la zona horaria de Bolivia
    let opciones = { timeZone: 'America/La_Paz' };
  
    // Obtener la fecha y hora local de Bolivia
    let fechaHoraBolivia = fechaHoraActual.toLocaleDateString('es-BO', opciones);
  
    // Convertir la fecha a formato año-mes-día
    let partesFecha = fechaHoraBolivia.split('/');


     // Obtener la hora en formato de 24 horas (ejemplo: 14:30)
     let hora = fechaHoraActual.getHours();
     let minutos = fechaHoraActual.getMinutes();
     let segundos = fechaHoraActual.getSeconds();
   
     // Formatear los minutos y segundos para asegurar que siempre tengan dos dígitos
     minutos = minutos < 10 ? '0' + minutos : minutos;
     segundos = segundos < 10 ? '0' + segundos : segundos;
   
     // Concatenar la hora en formato HH:MM:SS
     let horaActual = `${hora}:${minutos}:${segundos}`;


    let fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]} ${horaActual}`;
  
  
    return fechaFormateada;
  };