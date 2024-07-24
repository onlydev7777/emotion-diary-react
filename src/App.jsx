import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import New from "./pages/New.jsx";
import Diary from "./pages/Diary.jsx";
import NotFound from "./pages/NotFound.jsx";
import Edit from "./pages/Edit.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import {createContext, useEffect, useReducer, useState} from "react";
import useApi from "./hooks/useApi.jsx";
import {getDate, getStringedDate} from "./util/get-stringed-date.js";

function reducer(state, action) {
  let nextState;
  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE":
      nextState = [action.data, ...state];
      break;
    case "UPDATE":
      nextState = state.map(
          (item) => String(item.id) === String(action.data.id) ? action.data
              : item
      );
      break;
    case "DELETE":
      nextState = state.filter(
          (item) => String(item.id) !== String(action.data.id));
      break;
    default:
      return state;
  }

  // localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();
// 1. "/" : 모든 일기를 조회하는 Home 페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세히 조회하는 Diary 페이지
function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const [reducerType, setReducerType] = useState("INIT")
  const {response, error, loading, fetchData} = useApi("/diary/month-list",
      "get");
  const [apiLoading, setApiLoading] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(
      localStorage.getItem("Access-Token") != null);

  //api load
  useEffect(() => {
    if (loginSuccess && apiLoading) {
      const now = new Date();
      let month = now.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }

      fetchData({
        params: {
          diaryYearMonth: String(now.getFullYear()) + String(month)
        }
      })
    }
  }, [loginSuccess, apiLoading]);

  //api response setting
  useEffect(() => {
    if (response && response.status === 200) {
      const responseData = response.data.response;

      let diaryData;
      if (reducerType === "INIT") {
        diaryData = responseData.map((item) => {
          return {
            id: item.id,
            createdDate: getDate(item.diaryDate),
            emotionId: Number(item.emotionStatus),
            // subject: item.subject,
            content: item.content,
          };
        });
      } else if (reducerType === "CREATE" || reducerType === "UPDATE") {
        diaryData = {
          id: responseData.id,
          createdDate: getDate(responseData.diaryDate),
          emotionId: Number(responseData.emotionStatus),
          // subject: response.data.response[key].subject,
          content: responseData.content,
        };
      } else if (reducerType === "DELETE") {
        diaryData = {
          id: responseData.id
        }
      }

      // console.log(diaryData);
      dispatch({
        type: reducerType,
        data: diaryData,
      })

      setApiLoading(false);
    }
    if (error) {
      alert("[" + error.response.status + "] " + error.response.data);
      return;
    }
  }, [response]);

  //새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    setReducerType("CREATE");

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
    setReducerType("UPDATE");

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
    setReducerType("DELETE");

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
            value={{data, loginSuccess, setLoginSuccess}}>
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
