import { useParams } from "react-router-dom";

export default function NoticePage() {
  const { noticeId } = useParams();
  return <div>{noticeId}</div>;
}
