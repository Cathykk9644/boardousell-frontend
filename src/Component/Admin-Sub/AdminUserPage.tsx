import { useState } from "react";
import { CircularProgress } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type user = {
  id: 1;
  email: string;
  name: string;
  isAdmin: boolean;
  points: number;
  phone: number;
  level: {
    title: string;
  };
};
type key = "email" | "name" | "phone";

export default function AdminUserPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<user[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [type, setType] = useState<key>("email");
  const [errMsg, setErrMsg] = useState("");
  const [editId, setEditId] = useState<boolean | number | null>(null);
  const [editVal, setEditVal] = useState<string>("");
  const [expand, setExpanded] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BACKENDURL}/user/admin?${
          !!keyword.length ? type + "=" + keyword : ""
        }`
      );
      setUsers(data);
      setErrMsg("");
      setIsLoading(false);
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  const handleChange = (userId: number) => {
    if (editVal) {
      handleConfirmEdit();
    }
    setExpanded((prev) => (prev === userId ? null : userId));
  };

  const handleAdminChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: number
  ) => {
    try {
      setIsLoading(true);
      await axios.put(`${BACKENDURL}/user/${userId}`, {
        isAdmin: e.target.checked,
      });
      handleSearch();
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  const handleEdit = (userId: number, val: number) => {
    setEditId(userId);
    setEditVal(val.toString());
  };

  const handleConfirmEdit = async () => {
    try {
      setIsLoading(true);
      await axios.put(`${BACKENDURL}/user/${editId}`, {
        points: editVal,
      });
      handleSearch();
      setEditId(null);
      setEditVal("");
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  const userDiplay = users.map((user: user) => {
    return (
      <Accordion
        expanded={expand === user.id}
        onChange={() => handleChange(user.id)}
        key={user.id}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {type}: {user[type]}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <table className="table">
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Phone:</th>
                <td>{user.phone}</td>
              </tr>
              <tr>
                <th>Membership:</th>
                <td>{user.level.title}</td>
              </tr>
              <tr>
                <th>Points:</th>
                {editId === user.id ? (
                  <td className="flex flex-start">
                    <input
                      className="input input-sm"
                      value={editVal}
                      onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                          setEditVal(e.target.value);
                        }
                      }}
                    />
                    <button
                      className="btn btn-ghost btn-sm btn-square"
                      onClick={handleConfirmEdit}
                    >
                      <DoneRoundedIcon />
                    </button>
                  </td>
                ) : (
                  <td>
                    {user.points}
                    <button
                      className="ml-3 btn btn-ghost btn-sm btn-square"
                      onClick={() => handleEdit(user.id, user.points)}
                    >
                      <EditRoundedIcon />
                    </button>
                  </td>
                )}
              </tr>
              <tr>
                <th>Admin:</th>
                <td>
                  <input
                    type="checkbox"
                    checked={user.isAdmin}
                    className="checkbox checkbox-sm"
                    onChange={(e) => handleAdminChange(e, user.id)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion>
    );
  });

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
      <div className="flex items-center justify-between w-full space-x-3">
        <span className="text-md">Users:</span>
        <select
          value={type}
          className="select select-sm select-bordered"
          onChange={(e) => setType(e.target.value as key)}
        >
          <option value="email">Email</option>
          <option value="name">Name</option>
          <option value="phone">Phone</option>
        </select>
        <input
          className="input input-bordered input-sm w-full"
          placeholder="All"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button className="btn btn-md btn-square" onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <div className="w-5/6">
        {isLoading ? <CircularProgress /> : userDiplay}
      </div>
    </div>
  );
}
