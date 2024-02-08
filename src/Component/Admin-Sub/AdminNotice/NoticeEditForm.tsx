import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { storage } from "../../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import axios from "axios";
import { BACKENDURL } from "../../../constant";

type notice = {
  id: number;
  title: string;
  url?: string;
  detail: string;
};
type props = {
  open: boolean;
  notice: notice;
  setErrMsg: Function;
  setExpand: Function;
  setNotices: Function;
};
type editType = "title" | "detail" | null;
export default function NoticeEditForm({
  open,
  notice,
  setErrMsg,
  setExpand,
  setNotices,
}: props) {
  const [editInput, setEditInput] = useState<string>("");
  const [editType, setEditType] = useState<editType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = () => {
    if (open) {
      setExpand(null);
    } else setExpand(notice.id);
  };

  const handleChangePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    try {
      setIsLoading(true);
      const storageRef = ref(storage, `/notice/notice${notice.id}.jpg`);
      await uploadBytes(storageRef, e.target.files[0]);
      const url = await getDownloadURL(storageRef);
      const { data } = await axios.put(`${BACKENDURL}/notice/photo`, {
        noticeId: notice.id,
        url,
      });
      updateNotice(data);
    } catch (error) {
      setErrMsg("Somethings went wrong, cannot change photo.");
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsLoading(true);
      const storageRef = ref(storage, `/notice/notice${notice.id}.jpg`);
      await deleteObject(storageRef);
      const { data } = await axios.delete(
        `${BACKENDURL}/notice/photo/${notice.id}`
      );
      updateNotice(data);
    } catch (error) {
      setErrMsg("Somethings went wrong, cannot remove photo.");
      setIsLoading(false);
    }
  };

  const updateNotice = (data: notice) => {
    setNotices((prev: notice[]) => {
      const newNotices: notice[] = [...prev];
      const index = newNotices.findIndex((target) => target.id === notice.id);
      newNotices[index] = data;
      return newNotices;
    });
    setErrMsg("");
    setIsLoading(false);
  };

  return (
    <Accordion className="w-full" expanded={open} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {notice.title}
      </AccordionSummary>
      <AccordionDetails className="flex flex-col sm:flex-row">
        <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
          <CircularProgress />
        </Backdrop>
        <div className="flex flex-col sm:w-1/2 border-2 items-center">
          {notice.url ? (
            <img
              className="w-full m-3 cursor-pointer"
              src={notice.url}
              alt={notice.id.toString()}
              onClick={() => window.open(notice.url)}
            />
          ) : (
            "No Photo Yet."
          )}
          <div className="flex flex-col items-center m-5">
            <input
              className="file-input file-input-sm w-full"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleChangePhoto}
            />
            <button
              className="btn btn-wide btn-sm mt-2 w-full"
              onClick={handleRemovePhoto}
              disabled={!notice.url}
            >
              Remove <DeleteIcon />
            </button>
          </div>
        </div>
        <div></div>
      </AccordionDetails>
    </Accordion>
  );
}
