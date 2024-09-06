import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import DiaryList from "../components/DisaryList.jsx";
import {useContext, useEffect, useState} from "react";
import {DiaryStateContext} from "../App.jsx"
import usePageTitle from "../hooks/usePageTitle.jsx";
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import useApi from "../hooks/useApi.jsx";
import {
  getDateYearMonth,
  getStringYearMonth
} from "../util/get-stringed-date.js";

const Home = () => {
  const [pivotDate, setPivotDate] = useState(new Date());
  const {
    data,
    setData,
    setLoginSuccess,
    setAuthChecked,
    yearMonth,
    setYearMonth
  } = useContext(DiaryStateContext);
  const nav = useNavigate();
  const {response, error, loading, fetchData} = useApi(
      "/member/logout", "get");
  usePageTitle("감정일기장");

  useEffect(() => {
    if (response && response.status === 200) {
      localStorage.removeItem('id');
      setLoginSuccess(false);
      setAuthChecked(false);
      setData([]);
      alert("success logout!");
      nav("/signin", {replace: true})
      return;
    }
    if (error) {
      alert("[" + error.response.status + "] " + error.response.data);
      return;
    }
  }, [response]);

  const getYear = () => {
    return yearMonth.substring(0, 4);
  }

  const getMonth = () => {
    return yearMonth.substring(5, 6);
  }
  const onIncreaseMonth = () => {
    let currDate = getDateYearMonth(yearMonth);
    currDate.setMonth(currDate.getMonth() + 1);
    setYearMonth(getStringYearMonth(currDate));
  };

  const onDecreaseMonth = () => {
    let currDate = getDateYearMonth(yearMonth);
    currDate.setMonth(currDate.getMonth() - 1);
    setYearMonth(getStringYearMonth(currDate));
  };

  const onLogout = (e) => {
    e.preventDefault();
    fetchData({});
  }

  return (
      <div>
        <Header
            title={`${getYear()}년 ${getMonth()}월`}
            leftChild={<Button text={"<"} onCLick={onDecreaseMonth}/>}
            rightChild={<Button text={">"} onCLick={onIncreaseMonth}/>}/>
        <DiaryList data={data}/>
        <Footer rightChild={<Button text={"logout"} onCLick={onLogout}/>}/>
      </div>
  );
};

export default Home;