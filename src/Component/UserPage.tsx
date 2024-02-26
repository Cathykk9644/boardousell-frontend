import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import { outletProps, user } from "../type";
import { Skeleton } from "@mui/material";

type editing = {
  type: "name" | "phone" | null;
  input: string;
};

export default function UserPage(): JSX.Element {
  const { userId, setError } = useOutletContext<outletProps>();
  const [userInfo, setUserInfo] = useState<user | null>(null);
  const [editing, setEditing] = useState<editing>({ type: null, input: "" });
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    getAccessTokenSilently,
    user,
  } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      loginWithRedirect();
    }
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data }: { data: [user, boolean] } = await axios.get(
          `${BACKENDURL}/customer/user/${user!.sub}`,
          config
        );
        setUserInfo(data[0]);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot load your profile.",
        });
      }
    };
    if (userId) {
      fetchData();
    }
  }, [
    getAccessTokenSilently,
    isAuthenticated,
    loginWithRedirect,
    setError,
    userId,
    isLoading,
    user,
  ]);

  const handleEdit = (target: "name" | "phone") => {
    if (editing.type) {
      handleUpdate(editing.type);
    }
    if (editing.type === target) {
      setEditing({ type: null, input: "" });
    } else {
      setEditing({
        type: target,
        input: target === "name" ? userInfo!.name : userInfo!.phone.toString(),
      });
    }
  };

  const handleUpdate = async (target: "name" | "phone") => {
    try {
      let newData = { [target]: editing.input };
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.put(`${BACKENDURL}/customer/user/${userId}`, newData, config);
      setUserInfo({ ...userInfo!, [target]: editing.input });
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Somethings went wrong. Cannot update your profile.",
      });
    }
  };

  const membershipDisplay = userInfo ? (
    <div className="flex flex-col my-5">
      You are in {userInfo.level.title} membership now.
      <div className="flex flex-row justify-between items-center w-full">
        <progress
          className="progress progress-primary"
          value={userInfo.points}
          max={userInfo.level.requirement}
        />
        <span className="pl-1">
          {userInfo.points}/{userInfo.level.requirement}
        </span>
      </div>
      You will hit next level after{" "}
      {userInfo.level.requirement - userInfo.points} points
    </div>
  ) : (
    <Skeleton variant="text"></Skeleton>
  );

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-5/6 mt-5">
        <h1 className="text-xl m-3">User Profile:</h1>
        <table className="table border border-accent">
          <tbody>
            <tr>
              <th>Email:</th>
              <td>{userInfo?.email}</td>
            </tr>
            <tr>
              <th>Name:</th>
              <td className="flex flex-row justify-between items-center">
                {editing.type === "name" ? (
                  <input
                    className="input input-md input-bordered"
                    value={editing.input}
                    onChange={(e) =>
                      setEditing({ ...editing, input: e.target.value })
                    }
                  />
                ) : (
                  <span>{userInfo?.name}</span>
                )}
                <button
                  className="btn btn-square btn-sm flex-end"
                  onClick={() => handleEdit("name")}
                >
                  {editing.type === "name" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>Phone:</th>
              <td className="flex flex-row justify-between items-center">
                {editing.type === "phone" ? (
                  <input
                    type="input"
                    value={editing.input}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        setEditing({ ...editing, input: e.target.value });
                      }
                    }}
                  />
                ) : (
                  <span>
                    {userInfo?.phone
                      ? userInfo.phone
                      : "Do not have Phone No. Yet."}
                  </span>
                )}
                <button
                  className="btn btn-square btn-sm flex-end"
                  onClick={() => handleEdit("phone")}
                >
                  {editing.type === "phone" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>Points:</th>
              <td>{userInfo?.points}</td>
            </tr>
          </tbody>
        </table>
        {membershipDisplay}
      </div>
    </div>
  );
}
