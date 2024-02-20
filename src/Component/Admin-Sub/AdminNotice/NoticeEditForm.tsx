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
import { notice } from "../../../type";
import { useAuth0 } from "@auth0/auth0-react";

type props = {
  open: boolean;
  notice: notice;
  setErrMsg: Function;
  setExpand: Function;
  setNotices: Function;
};
type edit = { type: "title" | "detail" | null; input: string };
export default function NoticeEditForm({
  open,
  notice,
  setErrMsg,
  setExpand,
  setNotices,
}: props) {
  const [edit, setEdit] = useState<edit>({ type: null, input: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

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
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.put(
        `${BACKENDURL}/admin/notice/photo`,
        {
          noticeId: notice.id,
          url,
        },
        config
      );
      updateNotice(data);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot change photo.");
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsLoading(true);
      const storageRef = ref(storage, `/notice/notice${notice.id}.jpg`);
      await deleteObject(storageRef);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.delete(
        `${BACKENDURL}/admin/notice/photo/${notice.id}`,
        config
      );
      updateNotice(data);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot remove photo.");
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = async () => {
    if (edit.type && notice[edit.type] === edit.input) {
      return setErrMsg("");
    }
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (edit.type) {
        const { data } = await axios.put(
          `${BACKENDURL}/admin/notice/info`,
          {
            noticeId: notice.id,
            [edit.type]: edit.input,
          },
          config
        );
        return updateNotice(data);
      }
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update data.");
      setIsLoading(false);
    }
  };

  const handleEdit = (type: edit["type"]) => {
    if (edit.type) {
      handleConfirmEdit();
    }
    if (edit.type === type) {
      setEdit({ type: null, input: "" });
      return;
    }
    switch (type) {
      case "detail":
        setEdit({ type: type, input: notice.detail });
        break;
      case "title":
        setEdit({ type: type, input: notice.title });
        break;
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

  const handleDeleteNotice = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(
        `${BACKENDURL}/admin/notice/delete/${notice.id}`,
        config
      );
      setExpand(null);
      setIsLoading(false);
      setIsWarning(false);
      setErrMsg("");
      setNotices((prev: notice[]) =>
        prev.filter((target) => target.id !== notice.id)
      );
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot delete this notice.");
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
              value={edit.type === "title" ? edit.input : notice.title}
              disabled={edit.type !== "title"}
              onChange={(e) => setEdit({ ...edit, input: e.target.value })}
            />
            <button
              className="btn btn-sm btn-square"
              onClick={() => handleEdit("title")}
            >
              {edit.type === "title" ? (
                <DoneRoundedIcon />
              ) : (
                <EditRoundedIcon />
              )}
            </button>
          </div>
          <span className="self-start text-xl">Details:</span>
          <textarea
            className="textarea w-full h-36"
            value={edit.type === "detail" ? edit.input : notice.detail}
            disabled={edit.type !== "detail"}
            onChange={(e) => setEdit({ ...edit, input: e.target.value })}
          />
          <button
            className="btn btn-sm btn-accent w-full my-1"
            onClick={() => handleEdit("detail")}
          >
            {edit.type === "detail" ? "Done" : "Edit"}
            {edit.type === "detail" ? <DoneRoundedIcon /> : <EditRoundedIcon />}
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
