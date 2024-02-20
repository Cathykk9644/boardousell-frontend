import { useEffect, useState } from "react";
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
import { user } from "../../type";
import { useAuth0 } from "@auth0/auth0-react";

type search = {
  keyword: string;
  type: "email" | "name" | "phone" | "all";
};
type edit = {
  id: number | null;
  points: string;
};
export default function AdminUserPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<user[]>([]);
  const [search, setSearch] = useState<search>({ keyword: "", type: "all" });
  const [errMsg, setErrMsg] = useState<string>("");
  const [edit, setEdit] = useState<edit>({ id: null, points: "" });
  const [expand, setExpanded] = useState<number | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);

  const handleChangeSearchType = (target: search["type"]) => {
    switch (target) {
      case "all":
        setSearch({ type: "all", keyword: "" });
        break;
      case "phone":
        setSearch((prev: search) => {
          const newData = { ...prev };
          newData.type = "phone";
          if (isNaN(Number(search.keyword))) {
            newData.keyword = "";
          }
          return newData;
        });
        break;
      default:
        setSearch({ type: target, keyword: search.keyword });
    }
  };
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (search.type === "all") {
        const { data } = await axios.get(
          `${BACKENDURL}/admin/user/search`,
          config
        );
        setUsers(data);
      } else {
        const { data } = await axios.get(
          `${BACKENDURL}/admin/user/search?${
            !!search.keyword.length ? search.type + "=" + search.keyword : ""
          }`,
          config
        );
        setUsers(data);
      }
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot Search Users.");
      setIsLoading(false);
    }
  };

  const handleChangeExpand = (userId: number) => {
    if (!!edit.id) {
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
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.put(
        `${BACKENDURL}/admin/user/${userId}`,
        {
          isAdmin: e.target.checked,
        },
        config
      );
      handleSearch();
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update user data");
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.put(
        `${BACKENDURL}/admin/user/${edit.id}`,
        {
          points: edit.points,
        },
        config
      );
      handleSearch();
      setEdit({ id: null, points: "" });
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update user data.");
      setIsLoading(false);
    }
  };

  const userDisplay = users.length
    ? users.map((user: user) => {
        return (
          <Accordion
            expanded={expand === user.id}
            onChange={() => handleChangeExpand(user.id)}
            key={user.id}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {search.type === "all"
                  ? `name: ${user.name}`
                  : `${search.type}: ${user[search.type]}`}
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
                    {edit.id === user.id ? (
                      <td className="flex flex-start">
                        <input
                          className="input input-sm"
                          value={edit.points}
                          onChange={(e) => {
                            if (!isNaN(Number(e.target.value))) {
                              setEdit({ id: edit.id, points: e.target.value });
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
                          onClick={() =>
                            setEdit({
                              id: user.id,
                              points: user.points.toString(),
                            })
                          }
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
      })
    : "No user found in this current search.";

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
      <div className="flex items-center justify-between w-full space-x-3 sm:w-1/2">
        <span className="text-md">Users:</span>
        <select
          value={search.type}
          className="select select-sm select-bordered"
          onChange={(e) =>
            handleChangeSearchType(e.target.value as search["type"])
          }
        >
          <option value="all">All</option>
          <option value="email">Email</option>
          <option value="name">Name</option>
          <option value="phone">Phone</option>
        </select>
        {search.type !== "all" && (
          <input
            value={search.keyword}
            className="input input-bordered input-sm w-full"
            onChange={(e) =>
              setSearch({ type: search.type, keyword: e.target.value })
            }
          />
        )}

        <button className="btn btn-md btn-square" onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <div className="w-5/6 flex flex-col items-center">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="w-5/6">{userDisplay}</div>
        )}
      </div>
    </div>
  );
}
