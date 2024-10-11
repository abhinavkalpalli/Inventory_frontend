import axios from "axios";
import { userAuth } from "../const/localStorage";
import { BASE_URL } from "../const/url";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use(
  async (config) => {
    config.headers["Authorization"] = localStorage.getItem(userAuth);
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);
