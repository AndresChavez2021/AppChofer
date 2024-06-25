
import axios from "axios";

import { USER_TOKEN_KEY } from "../Providers/AuthProviders";
// import { BaseUrl } from "./Aws";
/* recupera datos del dispositivo Constants.manifest.url_api */
import * as SecureStore from "expo-secure-store";

import { Base_URL } from "./Api";

const  axiosInstance = axios.create({
  baseURL: `${Base_URL}/`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
/* intersectando las respuestas de la API */

axiosInstance.interceptors.request.use(async (req) => {
  const access_token = await SecureStore.getItemAsync(USER_TOKEN_KEY);
  req.headers["Authorization"] = `Bearer ${access_token}`;
  return req;
});

export default axiosInstance;
