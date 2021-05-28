import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.withCredentials = true;
export default instance;
