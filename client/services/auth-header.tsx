import { AxiosRequestHeaders } from "axios";
export default function authHeader(): AxiosRequestHeaders {
  const user = JSON.parse(localStorage.getItem("user") as string);
  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}
