import axios from "./setup";
export const PERMISSION_PATH = "/api/permissions";
export const ROLES_PATH = "/api/roles";
export const ROLES_PERMISSION_PATH = "/api/rolepermissions";
export const USER_ROLE_PATH = "/api/userroles";
export const USERS_PATH = "/api/users";
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
export function getPermissions() {
  const url = `${BASE_URL}${PERMISSION_PATH}`;
  return axios.get(url);
}
export function createPermission(data) {
  const url = `${BASE_URL}${PERMISSION_PATH}`;
  return axios.post(url, data);
}

export function deletePermission(id) {
  const url = `${BASE_URL}${PERMISSION_PATH}`;
  return axios.delete(url, { data: { id } });
}

export function getRoles() {
  const url = `${BASE_URL}${ROLES_PATH}`;
  return axios.get(url);
}
export function getSingleRole(id) {
  const url = `${BASE_URL}${ROLES_PATH}?id=${id}`;
  return axios.get(url);
}

export function deleteRole(id) {
  const url = `${BASE_URL}${ROLES_PATH}`;
  return axios.delete(url, { data: { id } });
}

export function createRole(data) {
  const url = `${BASE_URL}${ROLES_PATH}`;
  return axios.post(url, data);
}
export function updateRole(data) {
  const url = `${BASE_URL}${ROLES_PATH}`;
  return axios.patch(url, data);
}
export function deleteRolePermission(data) {
  const url = `${BASE_URL}${ROLES_PERMISSION_PATH}`;
  return axios.delete(url, { data });
}

export function getUsers() {
  const url = `${BASE_URL}${USERS_PATH}`;
  return axios.get(url);
}

export function deleteUser(id) {
  const url = `${BASE_URL}${USERS_PATH}`;
  return axios.delete(url, { data: { id } });
}

export function createUser(data) {
  const url = `${BASE_URL}${USERS_PATH}`;
  return axios.post(url, data);
}

export function updateUser(data) {
  const url = `${BASE_URL}${USERS_PATH}`;
  return axios.patch(url, data);
}
export function getSingleUser(id) {
  const url = `${BASE_URL}${USERS_PATH}?id=${id}`;
  return axios.get(url);
}
export function deleteUserRole(data) {
  const url = `${BASE_URL}${USER_ROLE_PATH}`;
  return axios.delete(url, { data });
}
