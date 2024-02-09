import axios from "axios";
import { ChangeEventHandler, useEffect, useState } from "react";
import { BACKENDURL } from "../../constant";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress, Dialog } from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import GoogleMap from "../ContactUs-Sub/GoogleMap";

type name = "Phone" | "Link" | "Email" | "Map";
type info = {
  id: number;
  name: name;
  detail: string;
};

//Only Need Add and Delete
export default function AdminInfoPage() {
  const [infos, setInfos] = useState<info[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("Phone");
  const [editDetail, setEditDetail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

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
        const { data } = await axios.get(`${BACKENDURL}/infomation/admin`);
        setInfos(data);
        setIsLoading(false);
      } catch (error) {
        setErrMsg("Cannot get data, please try again.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteInfo = async (infoId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/infomation/${infoId}`);
      setInfos((prev: info[]) => prev.filter((info) => info.id !== infoId));
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Cannot dalete data, please try again.");
      setIsLoading(false);
    }
  };

  const handleClick = (name: name, detail: string) => {
    switch (name) {
      case "Link":
        if (detail.startsWith("http")) {
          window.open(detail);
        } else {
          window.open(`http://${detail}`);
        }
        break;
      case "Map":
        setPreview(detail);
    }
  };

  const handleAdd = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${BACKENDURL}/infomation`, {
        name: editName,
        detail: editDetail,
      });
      setInfos((prev) => [data, ...prev]);
      setEditDetail("");
      setEditName("");
      setIsAdding(false);
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Cannot add now, please try again");
      setIsLoading(false);
    }
  };

  const handleEditName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Phone" && isNaN(Number(editDetail))) {
      setEditDetail("");
    }
    setEditName(e.target.value);
  };

  const handleEditDetail = (val: string) => {
    if (!(editName === "Phone" && isNaN(Number(val)))) {
      setEditDetail(val);
    }
  };

  const infoDisplay = infos.map((info) => {
    return (
      <tr key={info.id}>
        <th>{info.name}</th>
        <td>
          <span
            className={
              info.name === "Link" || info.name === "Map"
                ? "btn btn-link pl-0"
                : ""
            }
            onClick={() => handleClick(info.name, info.detail)}
          >
            {info.detail}
          </span>
        </td>
        <td>
          <button
            className="btn btn-square btn-outline btn-sm"
            onClick={() => deleteInfo(info.id)}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          {!isAdding && (
            <button
              className="btn w-full btn-outline"
              onClick={() => setIsAdding(true)}
            >
              Add Infomation
            </button>
          )}

          <table className="table">
            <tbody>
              {isAdding && (
                <tr>
                  <th>
                    <select
                      className="select select-sm select-bordered pl-3"
                      value={editName}
                      onChange={handleEditName}
                    >
                      <option value="Phone">Phone:</option>
                      <option value="Link">Link:</option>
                      <option value="Email">Email:</option>
                      <option value="Map">Map</option>
                    </select>
                  </th>
                  <td>
                    <input
                      type="input"
                      className="input input-sm input-bordered"
                      value={editDetail}
                      onChange={(e) => handleEditDetail(e.target.value)}
                    />
                    {editName === "Map" && (
                      <button
                        className="btn btn-link btn-small"
                        onClick={() => setPreview(editDetail)}
                      >
                        preview
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-square btn-outline btn-sm"
                      onClick={() => handleAdd()}
                    >
                      <DoneRoundedIcon />
                    </button>
                  </td>
                </tr>
              )}
              {infoDisplay}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={!!preview} onClose={() => setPreview(null)}>
        {preview && (
          <GoogleMap
            location={preview}
            setErrMsg={setErrMsg}
            setPreview={setPreview}
          />
        )}
      </Dialog>
    </div>
  );
}
