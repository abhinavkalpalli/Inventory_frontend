import { api } from "./api";
import { userAuth, refreshToken } from "../const/localStorage";
import { persistor } from "../app/store";
import { BASE_URL } from "../const/url";
import axios from "axios";
import Swal from "sweetalert2";


export const clearUser = async () => {
  localStorage.removeItem(userAuth);
  persistor.purge();
  await Swal.fire({
    title: "Blocked",
    text: "You are blocked by Admin",
    icon: "error",
    confirmButtonText: "OK",
  });
  window.location.reload("/");
};

// Function to make API calls with retry logic for token refresh
export const apiCall = async (method, url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      let error;

      // Determine HTTP method for request
      switch (method) {
        case "post":
          response = await api.post(url, data).catch((err) => {
            error = err;
          });
          break;
        case "get":
          response = await api.get(url, data).catch((err) => {
            error = err;
          });
          break;
        case "patch":
          response = await api.patch(url, data).catch((err) => {
            error = err;
          });
          break;
        case "delete":
          response = await api.delete(url, data).catch((err) => {
            error = err;
          });
          break;
        case "put":
          response = await api.put(url, data).catch((err) => {
            error = err;
          });
          break;
        default:
          throw new Error("Invalid HTTP method");
      }

      // Handle response or error
      if (response) {
        resolve(response);
      } else if (error) {
        console.log("Error response:", error);

        // Handle forbidden error
        if (error?.response?.status === 403) {
          localStorage.setItem(userAuth, "");
          localStorage.setItem(refreshToken, "");
          clearUser();
        }

        // Handle unauthorized error
        if (error?.response?.status === 401) {
          try {
            const newTokenResponse = await refreshAccessToken(error);
            resolve(newTokenResponse?.data);
          } catch (refreshError) {
            if (refreshError.response?.status === 401) {
              clearUser();
            } else {
              reject(refreshError);
            }
          }
        } else {
          reject(error?.response?.data || error.message);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

// Function to refresh access token
const refreshAccessToken = async (error) => {
  try {
    if (error.response?.status === 401) {
      const tokenRefresh = localStorage.getItem(refreshToken);

      if (tokenRefresh) {
        error.config._retry = true;

        return new Promise(async (resolve, reject) => {
          try {
            //refreshing the access token
            const response = await axios
              .post(`${BASE_URL}/api/auth/user/refresh-token`, null, {
                headers: {
                  Authorization: tokenRefresh,
                },
              })
              .catch((err) => {
                reject(err);
              });
            if (response) {
              const newAccessToken = response.data.newToken;
              localStorage.setItem(userAuth, newAccessToken);

              //calling the original request
              error.config.headers["Authorization"] = newAccessToken;

              axios(error.config)
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            }
          } catch (refreshError) {
            reject(refreshError);
          }
        });
      } else {
        clearUser();
      }
    }
  } catch (error) {
    clearUser();
  }
};
