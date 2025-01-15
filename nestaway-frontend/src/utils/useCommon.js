import { useContext, useEffect } from "react";
import api from "../api";
import { useSelector } from "react-redux";
import { AuthContext } from "../contexts/AuthContext";

const useCommon = () => {
  const BaseURL = import.meta.env.VITE_BASE_URL;
  const { currentUser } = useContext(AuthContext);

  let numberOfAjaxCAllPending = 0;
  useEffect(() => {
    const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
    let authToken = "";
    if (currentUser) authToken = currentUser?.accessToken;

    api.interceptors.request.use(
      (config) => {
        numberOfAjaxCAllPending++;
        if (!isAbsoluteURLRegex.test(config.url)) {
          config.url = BaseURL + config.url;
        }

        config.headers.Authorization = `Bearer ${authToken || ""}`;
        // console.log(config.headers);
        config.headers.RequestCount = numberOfAjaxCAllPending;
        return config;
      },
      (error) => Promise.reject(error)
    );
    api.interceptors.response.use(
      (response) => {
        numberOfAjaxCAllPending--;
        return response;
      },
      (error) => {
        numberOfAjaxCAllPending--;
        return Promise.reject(error);
      }
    );
  }, [BaseURL, currentUser, numberOfAjaxCAllPending]);
};

export default useCommon;
