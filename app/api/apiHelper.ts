import axios, { AxiosError, AxiosRequestConfig } from "axios";
import qs from "query-string";
import { message } from "antd";
import { ResponseStatus } from "./apiConst";
import store from "redux/store";

/**
 * Axios error interceptor
 * @param {AxiosError} axiosError
 */
 const errorInterceptor = (axiosError: AxiosError) => {
  if (axiosError && axiosError.response) {
    const response = axiosError.response;

    if (response.status === ResponseStatus.UNAUTHORIZED) {
      // If status of response from API is a 401, then log out
      // AuthHelper.logout();
    } else if (response.status.toString().startsWith("5")) {
      /**
       * If response status starts with a 5, indicating a server error,
       * then display user friendly error message
       */
      message.error("Something went worng in server");
    } else {
      // Else display error message returned from API
      if (response.status === ResponseStatus.ERROR_RESPONSE) {
        for (let error of response.data.errors) {
          for (let err of error.errors) {
            if (err.message) {
              message.error(err.message);
            }
          }
        }
      } else {
        const apiErrorMessage = response.data.localized_message
          ? response.data.localized_message
          : response.data.message;

        if (apiErrorMessage) {
          message.error(apiErrorMessage);
        }
      }
    }
  } else if (typeof axiosError === "object") {
    // If error response from API is not readeable, show default error
    message.error("Default fallback error");
  } else {
    // If not a custom 401 error, display error
    if (axiosError !== ResponseStatus.UNAUTHORIZED) {
      message.error(axiosError);
    }
  }

  return Promise.reject(axiosError);
};


/**
 * Adds autherization headers to API calls
 * @param {AxiosRequestConfig} request
 */
 const authInterceptor = async (request: AxiosRequestConfig) => {

  const accessToken = store.getState().authModel.token;

  if (accessToken) {
    request.headers["x-auth-token"] = accessToken;
    return request;
  } 

  return request;
};


/** Setup an API instance */
export const api = axios.create({
    baseURL: process.env.API_HOST,
    headers: {
      Application: process.env.APPLICATION,
      "Content-Type": "application/json",
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: "index" });
    },
});

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use(res => res, errorInterceptor);