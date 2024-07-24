import Button from "./Button.jsx";
import "./DiaryList.css"
import DiaryItem from "./DiaryItem.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const DiaryList = ({data}) => {
  const nav = useNavigate();
  const [sortType, setSortType] = useState("latest");

  const onChangeSortType = (e) => {
    setSortType(e.target.value);
  }

  const getSortedData = () => {
    // return data.toSorted((a, b) =>
    //     sortType === "oldest"
    //         ? Number(a.createdDate.replace(/-/g, '')) - Number(
    //         b.createdDate.replace(/-/g, ''))
    //         : Number(b.createdDate.replace(/-/g, '')) - Number(
    //         a.createdDate.replace(/-/g, ''))
    // );
    return data;
  };

  const sortedData = getSortedData();

  return (
      <div className="DiaryList">
        <div className="menu_bar">
          <select onChange={onChangeSortType}>
            <option value={"latest"}>최신순</option>
            <option value={"oldest"}>오래된 순</option>
          </select>
          <Button text={"새 일기 쓰기"} type={"POSITIVE"}
                  onCLick={() => {
                    nav("/new");
                  }}/>
        </div>
        <div className="list_wrapper">
          {sortedData.map((item) => <DiaryItem key={item.id} {...item}/>)}
        </div>
      </div>
  );
};

export default DiaryList;