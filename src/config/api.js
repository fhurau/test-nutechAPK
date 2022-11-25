import axios from "axios";

export const API = axios.create(
  {
    baseURL: "https://api.v2.kontenbase.com/query/api/v1/8a6aa031-16af-48f9-817c-8c523b2e71cb",
  }
//   {
//     baseURL: "https://nutechapp.herokuapp.com/api/v1/",
//   }
);

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
