import React, {
    createContext,
    useReducer,
    useMemo,
    useContext,
    useEffect,
  } from "react";
  import * as axios from "axios";
  import { getItemAsync } from "expo-secure-store";
  import AuthReducer, {
    initialState,
    RESTORE_TOKEN,
    SIGN_IN,
    SIGN_OUT,
  } from "../Reducers/AuthReducer";
  
  import Wrapper from "../Navigation/AppNavigation";
  
  export const USER_TOKEN_KEY = "userToken";
  export const USER_KEY = "user";
  export const AuthContext = createContext();
  
  const AuthProvider = () => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);
  
    useEffect(() => {
      const bootAsync = async () => {
        let userToken;
        try {
          userToken = await getItemAsync(USER_TOKEN_KEY);
        } catch (error) {
          alert("EL token no se ha podido restaurar,cierra la App");
        }
        /* accion para restaurar el token */
        dispatch({
          type: RESTORE_TOKEN,
          token: userToken,
        });
      };
  
      bootAsync().then(() => {});
    });
    /* LLamadas a los metodos de sesion para mantener el estado de autenticacion en la APP */
    const handleLogin = async ({token,user}) => {
      try {
        dispatch({ type: SIGN_IN, token, user });
      } catch (error) {
        throw new Error(error);
      }
    };
    const handleLogout = async () => {
      try {
        delete axios.defaults.headers.common["Authorization"];
  
      } catch (e) {
  
        throw new Error(e);
  
      } finally {
        dispatch({ type: SIGN_OUT });
      }
    };
  
    const authContext=useMemo(()=>{
      return{
          state,handleLogin,handleLogout
      }
  
    },[state]);
  
    return (
      <AuthContext.Provider value={authContext}>
          <Wrapper userToken={state.userToken}/>
      </AuthContext.Provider>
    );
  };
  
  
  const useAuth=() => useContext(AuthContext);
  
  export {useAuth,AuthProvider};