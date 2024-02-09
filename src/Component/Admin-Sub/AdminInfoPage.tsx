import axios from "axios";
import { useEffect, useState } from "react";
import { BACKENDURL } from "../../constant";

import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";

type info = {
  id: number;
  name: "Phone" | "Link" | "Email" | "Map";
  detail: string;
};

//Only Need Add and Delete
export default function AdminInfoPage() {
  const [infos, setInfos] = useState<info[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        <div className="w-5/6">
          <button className="btn w-full btn-outline">Add Infomation</button>
          <table className="table">
            <tbody>{infoDisplay}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
