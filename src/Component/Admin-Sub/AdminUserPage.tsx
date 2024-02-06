import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axios from "axios";
import { BACKENDURL } from "../../constant";

type user = {
  id: 1;
  email: string;
  name: string;
  isAdmin: boolean;
  points: number;
  phone: number;
};

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState<string>("");
  const [type, setType] = useState<string>("email");
  const [errMsg, setErrMsg] = useState("");

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        `${BACKENDURL}/user/admin?${
          !!keyword.length ? +type + "=" + keyword : ""
        }`
      );
      setUsers(data);
      setErrMsg("");
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };
  console.log(users);
  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
      <div className="flex items-center justify-center">
        <span className="text-md">Search Users:</span>
        <select
          value={type}
          className="mx-3 select select-sm select-bordered"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="email">Email</option>
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="isAdmin">Admin</option>
        </select>
        <button className="btn btn-md btn-square" onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <input className="input input-bordered input-md" placeholder="All" />
    </div>
  );
}
