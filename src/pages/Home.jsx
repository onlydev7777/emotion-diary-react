import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import DiaryList from "../components/DisaryList.jsx";
import {useContext, useEffect, useState} from "react";
import {DiaryStateContext} from "../App.jsx"
import usePageTitle from "../hooks/usePageTitle.jsx";
import {useNavigate} from "react-router-dom";

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
  usePageTitle("감정일기장");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token === null || token === 'undefined') {
      alert("로그인 후 이용 바랍니다.");
      nav("/signin", {replace: true})
      return;
    }
  }, [token]);

  const monthlyData = getMonthlyData(pivotDate, data);

  const onIncreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1));
  };

  const onDecreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1));
  };

  return (
      <div>
        <Header
            title={`${pivotDate.getFullYear()}년 ${pivotDate.getMonth() + 1}월`}
            leftChild={<Button text={"<"} onCLick={onDecreaseMonth}/>}
            rightChild={<Button text={">"} onCLick={onIncreaseMonth}/>}/>
        <DiaryList data={monthlyData}/>
      </div>
  );
};

export default Home;