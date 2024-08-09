import {DiaryStateContext} from "../App.jsx";
import {useContext} from "react";
import {Navigate} from "react-router-dom";

const PublicRoute = ({element}) => {
  const {loginSuccess} = useContext(DiaryStateContext);

  // 로그인된 상태에서 접근하면 홈으로 리다이렉트
  if (loginSuccess) {
    return <Navigate to="/" replace/>;
  }

  return element;
};

export default PublicRoute;
