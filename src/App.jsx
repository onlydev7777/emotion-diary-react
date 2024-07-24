import {Route, Routes} from "react-router-dom";
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
  const {response, error, loading, fetchData} = useApi("/diary/month-list",
      "get");
  const [apiLoading, setApiLoading] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(
      localStorage.getItem("Access-Token") != null);

  //api load
  useEffect(() => {
    if (loginSuccess && apiLoading) {
      onInit();
    }
  }, [loginSuccess, apiLoading, yearMonth]);

  useEffect(() => {
    onInit();
  }, [yearMonth]);

  //api response setting
  useEffect(() => {
    if (response && response.status === 200) {
      const responseData = response.data.response;

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
              setYearMonth
            }}>
          <DiaryDispatchContext.Provider value={{onCreate, onUpdate, onDelete}}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/signin" element={<SignIn/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/new" element={<New/>}/>
              <Route path="/diary/:id" element={<Diary/>}/>
              <Route path="/edit/:id" element={<Edit/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>
      </>
  )
}

export default App
