import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKENDURL } from "../../constant";
import NoticeEditForm from "./AdminNotice/NoticeEditForm";
import NoticeAddForm from "./AdminNotice/NoticeAddForm";
import { notice } from "../../type";
export default function AdminNoticePage() {
  const [notices, setNotices] = useState<notice[]>([]);
  const [expand, setExpand] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${BACKENDURL}/notice`);
        setNotices(data);
        setErrMsg("");
        setIsLoading(false);
      } catch (error) {
        setErrMsg("Cannot get data");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const noticeDisplay = notices.map((notice) => (
    <NoticeEditForm
      open={expand === notice.id}
      notice={notice}
      setErrMsg={setErrMsg}
      setExpand={setExpand}
      setNotices={setNotices}
      key={notice.id}
    />
  ));

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
      <button
        className="btn btn-wide btn-outline my-5"
        onClick={() => setIsAdding(true)}
      >
        Add Notice
      </button>
      <div className="w-5/6 flex flex-col items-center">
        {isLoading ? <CircularProgress /> : noticeDisplay}
      </div>
      <NoticeAddForm
        open={isAdding}
        setOpen={setIsAdding}
        setNotices={setNotices}
      />
    </div>
  );
}
