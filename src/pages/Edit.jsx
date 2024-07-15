import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Editor from "../components/Editor.jsx";
import {useContext} from "react";
import {DiaryDispatchContext} from "../App.jsx";
import useDiary from "../hooks/useDiary.jsx";
import usePageTitle from "../hooks/usePageTitle.jsx";

const Edit = () => {
  const params = useParams();
  const nav = useNavigate();
  const {onUpdate, onDelete} = useContext(DiaryDispatchContext);
  const curDiaryItem = useDiary(params.id);
  usePageTitle(`${params.id}번 일기 수정`);
  //1. 최초 load 시에는 undefined 반환
  if (!curDiaryItem) {
    return <div>데이터 로딩중...</div>;
  }
  //2. 렌더링 된 후 useDiary > useEffect로 curDiaryItem 다시 리렌더링

  const onClickDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete(params.id);
      nav("/", {replace: true});
    }
  }

  const onSubmit = (input) => {
    if (window.confirm("정말 수정하시겠습니까?")) {
      onUpdate(params.id, input.createdDate.getTime(), input.emotionId,
          input.content);
      nav("/", {replace: true});
    }
  }

  return (
      <div>
        <Header title={"일기 수정하기"}
                leftChild={<Button text={"< 뒤로가기"} onCLick={() => nav(-1)}/>}
                rightChild={<Button text={"삭제하기"} type={"NEGATIVE"}
                                    onCLick={() => onClickDelete()}/>}
        />
        <Editor initData={curDiaryItem} onSubmit={onSubmit}/>
      </div>
  );
};

export default Edit;