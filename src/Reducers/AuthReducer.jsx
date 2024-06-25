export const RESTORE_TOKEN = 'RESTORE_TOKEN';// restaura el token para q el usuario entre directo si esta logueado

export const SIGN_IN = 'SIGN_IN';//

export const SIGN_OUT = 'SIGN_OUT';//

/* ESTADO INICIAL DE LA APP */
export const initialState = {
    userToken: null,
    user:null,
}
/* GUARDANDO ESTADO DEL USUARIO =>TOKEN */
const AuthReducer=(prevState:{user:null,userToken:null}=initialState,action)=>{
    switch(action.type){
        /* cuando se restaure el token añade uno nuevo */
        case RESTORE_TOKEN:{
            return {
                ...prevState,
                userToken:action.token,
                user:action.user,
            }
        }
        case SIGN_IN:{
            return {
                ...prevState,
                userToken:action.token,
                user:action.user,
            }
        }
        case SIGN_OUT:{
            return {
                ...prevState,
                userToken:null,
                user:null,
            }
        }
        
    }
};
/* video 35 inicial */
export default AuthReducer;