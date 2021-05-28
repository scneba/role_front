import axios from "./setup";

export function getCategories() {
  return axios.get("/categories");
}
