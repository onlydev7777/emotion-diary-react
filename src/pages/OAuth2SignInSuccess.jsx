import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.jsx";
import {getCookie, removeCookie} from "../util/cookie.js";
import {DiaryStateContext} from "../App.jsx";

const OAuth2SignInSuccess = () => {
  const {loginSuccess, setLoginSuccess, setAuthChecked} = useContext(
      DiaryStateContext);
  const nav = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("Authorization");
    const memberId = getCookie("id");
    if (accessToken && memberId) {
      axiosInstance.defaults.headers.common['Authorization'] = accessToken;
      localStorage.setItem("id", memberId);
      removeCookie("Authorization");
      removeCookie("id");
      setLoginSuccess(true);
      setAuthChecked(true);
      nav("/", {replace: true});
    } else {
      nav("/signin", {replace: true})
    }
    return;
  }, [loginSuccess]);
}
export default OAuth2SignInSuccess