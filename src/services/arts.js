import axios from "./setup";

export function getArts() {
  return axios.get("/arts");
}
