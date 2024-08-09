import {useContext} from "react";
import {DiaryStateContext} from "../App.jsx";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({element, ...rest}) => {
  const {loginSuccess, authChecked} = useContext(DiaryStateContext);

  // 인증 상태 체크가 완료되지 않은 경우 로딩 중 상태를 보여줄 수 있음
  if (!authChecked) {
    return <div>로딩 중...</div>;
  }

  // 인증이 완료되었지만 로그인되지 않은 경우 리다이렉트
  if (!loginSuccess) {
    return <Navigate to="/signin" replace/>;
  }

  // 로그인 상태라면 요청한 컴포넌트를 렌더링
  return element;
};

export default PrivateRoute;