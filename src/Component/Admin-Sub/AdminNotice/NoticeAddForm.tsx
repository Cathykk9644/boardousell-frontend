import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BACKENDURL } from "../../../constant";
import { storage } from "../../../firebase";
import axios from "axios";

type props = {
  open: boolean;
  setOpen: Function;
  setNotices: Function;
};
type newData = {
  title: string;
  detail: string;
};
export default function NoticeAddForm({ open, setOpen, setNotices }: props) {
  const [newData, setNewData] = useState<newData>({ title: "", detail: "" });
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  type notice = {
    id: number;
    title: string;
    url?: string;
    detail: string;
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      setFileName("");
      setFileValue(null);
    } else {
      setFileName(e.target.value);
      setFileValue(e.target.files[0]);
    }
  };

  const handleAddNotice = async () => {
    if (!newData.title.length) {
      return setErrMsg("You need to add title first.");
    }
    try {
      setIsloading(true);
      const { data }: { data: notice } = await axios.post(
        `${BACKENDURL}/notice`,
        newData
      );
      if (fileValue) {
        const photoRef = ref(storage, `notice/notice${data.id}.jpg`);
        await uploadBytes(photoRef, fileValue);
        const url = await getDownloadURL(photoRef);
        await axios.put(`${BACKENDURL}/notice/photo`, {
          noticeId: data.id,
          url,
        });
        data.url = url;
      }
      setNotices((prev: notice[]) => {
        const newNotices = [...prev];
        newNotices.unshift(data);
        return newNotices;
      });
      setNewData({ title: "", detail: "" });
      setFileName("");
      setFileValue(null);
      setErrMsg("");
      setOpen(false);
      setIsloading(false);
    } catch (error) {
      setErrMsg("Sorry, cannot add now, please try again.");
      setIsloading(false);
    }
  };

  return (
    <Dialog open={open}>
      <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
        <CircularProgress />
      </Backdrop>
      <DialogTitle className="flex justify-between">
        <div>Notice:</div>
        <button
          className="btn btn-square btn-sm"
          onClick={() => setOpen(false)}
        >
          <CloseRoundedIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        <table className="table">
          <tbody>
            <tr>
              <th>Title:</th>
              <td>
                <input
                  className="input input-sm"
                  value={newData.title}
                  onChange={(e) =>
                    setNewData({ ...newData, title: e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <th>Detail:</th>
              <td>
                <textarea
                  className="textarea w-full h-36"
                  value={newData.detail}
                  onChange={(e) =>
                    setNewData({ ...newData, detail: e.target.value })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input
          className="file-input file-input-sm"
          type="file"
          accept="image/png, image/jpeg"
          value={fileName}
          onChange={handleFileChange}
        />
      </DialogContent>
      <DialogActions className="flex flex-col items-center">
        <span className="text-error m-1">{errMsg}</span>
        <button className="btn btn-wide btn-accent" onClick={handleAddNotice}>
          Add
        </button>
      </DialogActions>
    </Dialog>
  );
}
