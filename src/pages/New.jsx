import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Editor from "../components/Editor.jsx";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {DiaryDispatchContext} from "../App.jsx";
import usePageTitle from "../hooks/usePageTitle.jsx";

const New = () => {
  const nav = useNavigate();
  const {onCreate} = useContext(DiaryDispatchContext);
  usePageTitle("새 일기 쓰기");
  
  const onSubmit = (input) => {
    onCreate(input.createdDate.getTime(), input.emotionId, input.content);
    nav("/", {replace: true});
  }

  return (
      <div>
        <div>
          <Header title={"새 일기 쓰기"}
                  leftChild={<Button text={"< 뒤로가기"}
                                     onCLick={() => nav(-1)}/>
                  }
          />
        </div>
        <div>
          <Editor onSubmit={onSubmit}/>
        </div>
      </div>
  );
}

export default New