import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "./pages/Home.jsx";
import New from "./pages/New.jsx";
import Diary from "./pages/Diary.jsx";
import NotFound from "./pages/NotFound.jsx";
import Edit from "./pages/Edit.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import {createContext, useEffect, useState} from "react";
import useApi from "./hooks/useApi.jsx";
import {
  getDate,
  getStringedDate,
  getStringYearMonth
} from "./util/get-stringed-date.js";
import OAuth2SignInSuccess from "./pages/OAuth2SignInSuccess.jsx";
import axiosInstance from "./api/axiosConfig.jsx";
import PublicRoute from "./pages/PublicRoute.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();
// 1. "/" : 모든 일기를 조회하는 Home 페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세히 조회하는 Diary 페이지
function App() {
  // const [isLoading, setIsLoading] = useState(true);
  // const [data, dispatch] = useReducer(reducer, []);
  const [data, setData] = useState([]);
  const [apiMethod, setApiMethod] = useState("INIT");
  const [yearMonth, setYearMonth] = useState(getStringYearMonth(new Date()));
  const {response, error, loading, fetchData} = useApi(
      "/diary/month-list",
      "get");
  const [apiLoading, setApiLoading] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(
      !!localStorage.getItem("id"));
  const nav = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);//인증체크 여부 검증
  const {pathname} = useLocation(); // 현재 경로 가져오기

  useEffect(() => {
    const checkAuthStatus = async () => {
      let id = localStorage.getItem('id');
      const accessToken = axiosInstance.defaults.headers.common['Authorization'];

      if (id && !accessToken) { // id는 있지만, accessToken이 설정되지 않았을 때
        try {
          const response = await axiosInstance.post('/member/refresh-token');
          axiosInstance.defaults.headers.common["Authorization"] = response.headers.authorization; // 새로운 access-token
          localStorage.setItem('id', response.data.id);
          setLoginSuccess(true);
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem("id");
          alert("로그인 유효시간이 지났습니다. 재로그인 바랍니다.");
          nav("/signin", {replace: true});
          return;
        }
      }

      setAuthChecked(true); // 인증이 끝나면 authChecked를 true로 설정
    };

    checkAuthStatus(); // 컴포넌트가 마운트될 때 체크
  }, []);

  useEffect(() => {
    // PublicRoute에서 검증 회피
    const publicPaths = ["/signin", "/signup", "/oauth2-signin-success"];
    if (publicPaths.includes(pathname)) {
      return;
    }

    if (authChecked && !loginSuccess) {
      alert("로그인 후 이용 바랍니다.");
      nav("/signin", {replace: true})
      return;
    }

  }, [loginSuccess, authChecked]);

  //first load
  //api load
  useEffect(() => {
    if (loginSuccess && authChecked) {
      onInit();
    }
  }, [loginSuccess, authChecked, yearMonth]);

  //api response setting
  useEffect(() => {
    if (response && response.status === 200) {
      const responseData = response.data.response.diaryResponses;

      if (apiMethod === "INIT") {
        const mappingData = responseData.map((item) => {
          return {
            id: item.id,
            createdDate: getDate(item.diaryDate),
            emotionId: Number(item.emotionStatus),
            // subject: item.subject,
            content: item.content,
          };
        });
        setData(mappingData);
      } else {
        setApiMethod("INIT");
        onInit();
      }

      setApiLoading(false);
    }
    if (error) {
      alert("[" + error.response.status + "] " + error.response.data);
      return;
    }
  }, [response]);

  const onInit = () => {
    fetchData({
      url: "/diary/" + localStorage.getItem('id') + "/month-list",
      params: {
        diaryYearMonth: yearMonth
      }
    });
  }
  //새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    setApiMethod("CREATE");

    fetchData({
      url: "/diary",
      method: "post",
      data: {
        memberId: localStorage.getItem('id'),
        diaryDate: getStringedDate(new Date(createdDate)),
        emotionStatus: String(emotionId),
        content: content
      }
    })
  };
  //일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    setApiMethod("UPDATE");

    fetchData({
      url: "/diary",
      method: "patch",
      data: {
        id: id,
        memberId: localStorage.getItem('id'),
        diaryDate: getStringedDate(new Date(createdDate)),
        emotionStatus: String(emotionId),
        content: content
      }
    })
  };

  //일기 삭제
  const onDelete = (id) => {
    setApiMethod("DELETE");

    fetchData({
      url: "/diary/" + id,
      method: "delete",
    })
  };

  if (loginSuccess && apiLoading) {
    return (
        <div>데이터 로딩중...</div>
    );
  }

  return (
      <>
        <DiaryStateContext.Provider
            value={{
              data,
              loginSuccess,
              setLoginSuccess,
              yearMonth,
              setYearMonth,
              setAuthChecked,
              authChecked,
              setData
            }}>
          <DiaryDispatchContext.Provider value={{onCreate, onUpdate, onDelete}}>
            <Routes>
              <Route path="/signin"
                     element={<PublicRoute element={<SignIn/>}/>}/>
              <Route path="/signup"
                     element={<PublicRoute element={<SignUp/>}/>}/>
              <Route path="/oauth2-signin-success"
                     element={<PublicRoute element={<OAuth2SignInSuccess/>}/>}/>
              <Route path="/" element={<PrivateRoute element={<Home/>}/>}/>
              <Route path="/new" element={<PrivateRoute element={<New/>}/>}/>
              <Route path="/diary/:id"
                     element={<PrivateRoute element={<Diary/>}/>}/>
              <Route path="/edit/:id"
                     element={<PrivateRoute element={<Edit/>}/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>
      </>
  )
}

export default App
