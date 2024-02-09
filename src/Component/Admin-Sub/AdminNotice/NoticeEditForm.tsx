import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
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
  const [isWarning, setIsWarning] = useState<boolean>(false);

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

  const handleConfirmEdit = async () => {
    if (editType && notice[editType] === editInput) {
      return setErrMsg("");
    }
    console.log("here");
    try {
      setIsLoading(true);
      if (editType) {
        const { data } = await axios.put(`${BACKENDURL}/notice/info`, {
          noticeId: notice.id,
          [editType]: editInput,
        });
        updateNotice(data);
      }
      setIsLoading(false);
      setErrMsg("");
    } catch (error) {
      setErrMsg("Somethings went wrong, please edit again");
      setIsLoading(false);
    }
  };

  const handleEdit = (type: editType) => {
    if (editType) {
      handleConfirmEdit();
    }
    if (editType === type) {
      setEditType(null);
      setEditInput("");
      return;
    }
    switch (type) {
      case "detail":
        setEditInput(notice.detail);
        break;
      case "title":
        setEditInput(notice.title);
        break;
    }
    setEditType(type);
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

  const handleDeleteNotice = async () => {
    try {
      await axios.delete(`${BACKENDURL}/notice/delete/${notice.id}`);
      setExpand(null);
      setIsLoading(false);
      setIsWarning(false);
      setErrMsg("");
      setNotices((prev: notice[]) =>
        prev.filter((target) => target.id !== notice.id)
      );
    } catch (error) {
      setErrMsg("Somethings went wrong, please delete again");
      setIsLoading(false);
    }
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
        <div className="flex flex-col items-center justify-center sm:w-1/2 sm:pl-3 my-2">
          <div className="flex flex-row justify-between border-y-2 py-2 w-full">
            <span className="w-1/6 text-xl">Title: </span>
            <input
              className="input input-sm w-4/6"
              value={editType === "title" ? editInput : notice.title}
              disabled={editType !== "title"}
              onChange={(e) => setEditInput(e.target.value)}
            />
            <button
              className="btn btn-sm btn-square"
              onClick={() => handleEdit("title")}
            >
              {editType === "title" ? <DoneRoundedIcon /> : <EditRoundedIcon />}
            </button>
          </div>
          <span className="self-start text-xl">Details:</span>
          <textarea
            className="textarea w-full h-36"
            value={editType === "detail" ? editInput : notice.detail}
            disabled={editType !== "detail"}
            onChange={(e) => setEditInput(e.target.value)}
          />
          <button
            className="btn btn-sm btn-accent w-full my-1"
            onClick={() => handleEdit("detail")}
          >
            {editType === "detail" ? "Done" : "Edit"}
            {editType === "detail" ? <DoneRoundedIcon /> : <EditRoundedIcon />}
          </button>
        </div>
      </AccordionDetails>
      <AccordionActions className="flex">
        <button className="btn btn-error" onClick={() => setIsWarning(true)}>
          Delete notice
          <DeleteIcon />
        </button>
      </AccordionActions>
      <Dialog open={isWarning}>
        <DialogTitle>Do you want to delete this notice?</DialogTitle>
        <DialogContent>
          The notice cannot be retrieved after deleted.
        </DialogContent>
        <DialogActions>
          <button className="btn btn-error" onClick={handleDeleteNotice}>
            Delete
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setIsWarning(false)}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </Accordion>
  );
}
