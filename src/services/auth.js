import axios from "./setup";

export const LOGIN_PATH = "/auth/login";
export const LOGOUT_PATH = "/auth/logout";
export const PAGES_PATH = "/pages";
export const CURRENT_USER_PATH = "/auth/currentUser";
const BASE_URL = process.env.REACT_APP_BACKEND;

export function login(data) {
  const url = `${BASE_URL}${LOGIN_PATH}`;
  return axios.post(url, data);
}
export function logout(id) {
  const url = `${BASE_URL}${LOGOUT_PATH}`;
  return axios.post(url, { id });
}
export function getCurrentUser() {
  const url = `${BASE_URL}${CURRENT_USER_PATH}`;
  return axios.get(url);
}
