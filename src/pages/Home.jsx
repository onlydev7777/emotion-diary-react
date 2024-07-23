import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import DiaryList from "../components/DisaryList.jsx";
import {useContext, useEffect, useState} from "react";
import {DiaryStateContext} from "../App.jsx"
import usePageTitle from "../hooks/usePageTitle.jsx";
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import useApi from "../hooks/useApi.jsx";

const getMonthlyData = (pivotDate, data) => {
  const beginTime = new Date(pivotDate.getFullYear(), pivotDate.getMonth(), 1,
      0, 0, 0).getTime();

  const endTime = new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1, 0,
      23, 59, 59).getTime();

  return data.filter(
      (item) => beginTime <= item.createdDate && item.createdDate <= endTime
  );
}
const Home = () => {
  const [pivotDate, setPivotDate] = useState(new Date());
  const data = useContext(DiaryStateContext);
  const nav = useNavigate();
  const {response, error, loading, fetchData} = useApi("/auth/logout", "get");
  usePageTitle("감정일기장");
  const token = localStorage.getItem('Access-Token');

  useEffect(() => {
    if (token === null || token === 'undefined') {
      alert("로그인 후 이용 바랍니다.");
      nav("/signin", {replace: true})
      return;
    }
  }, [token]);

  useEffect(() => {
    if (response && response.status === 200) {
      localStorage.removeItem('Access-Token');
      localStorage.removeItem('Refresh-Token');
      alert("success logout!");
      nav("/signin", {replace: true})
      return;
    }
    if (error) {
      alert("[" + error.response.status + "] " + error.response.data);
      return;
    }
  }, [response]);

  const monthlyData = getMonthlyData(pivotDate, data);

  const onIncreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1));
  };

  const onDecreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1));
  };

  const onLogout = (e) => {
    e.preventDefault();
    fetchData({});
  }

  return (
      <div>
        <Header
            title={`${pivotDate.getFullYear()}년 ${pivotDate.getMonth() + 1}월`}
            leftChild={<Button text={"<"} onCLick={onDecreaseMonth}/>}
            rightChild={<Button text={">"} onCLick={onIncreaseMonth}/>}/>
        <DiaryList data={monthlyData}/>
        <Footer rightChild={<Button text={"logout"} onCLick={onLogout}/>}/>
      </div>
  );
};

export default Home;