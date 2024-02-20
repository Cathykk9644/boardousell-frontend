import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import { outletProps, level, user } from "../type";

type userLevel = {
  points: number;
  level: level;
};

export default function UserPage(): JSX.Element {
  const { userId, setError } = useOutletContext<outletProps>();
  const [email, setEmail] = useState<string>("");
  const [editing, setEditing] = useState<"name" | "phone" | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [levelInfo, setLevelInfo] = useState<userLevel | null>(null);
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    getAccessTokenSilently,
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
        const { data }: { data: user } = await axios.get(
          `${BACKENDURL}/customer/user/${userId}`,
          config
        );
        setEmail(data.email);
        setName(data.name);
        setPhone(data.phone ? data.phone.toString() : "");
        setLevelInfo({ points: data.points, level: data.level });
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Sorry, cannot load your profile for now.",
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
  ]);

  const handleEdit = (target: "name" | "phone") => {
    if (editing) {
      handleUpdate(editing);
    }
    if (editing === target) {
      setEditing(null);
    } else {
      setEditing(target);
    }
  };

  const handleUpdate = async (target: "name" | "phone") => {
    try {
      let newData;
      switch (target) {
        case "name":
          newData = { name: name };
          break;
        case "phone":
          newData = { phone: phone };
          break;
      }
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.put(`${BACKENDURL}/customer/user/${userId}`, newData, config);
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Sorry, cannot update your profile for now.",
      });
    }
  };

  const membershipDisplay = (
    <div className="flex flex-col my-5">
      You are in {levelInfo?.level.title} membership now.
      <div className="flex flex-row justify-between items-center w-full">
        <progress
          className="progress progress-primary"
          value={levelInfo?.points}
          max={levelInfo?.level.requirement}
        />
        <span className="pl-1">
          {levelInfo?.points}/{levelInfo?.level.requirement}
        </span>
      </div>
      You will hit next level after{" "}
      {levelInfo && levelInfo.level.requirement - levelInfo.points} points
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-5/6 mt-5">
        <h1 className="text-xl m-3">User Profile:</h1>
        <table className="table border border-accent">
          <tbody>
            <tr>
              <th>Email:</th>
              <td>{email}</td>
            </tr>
            <tr>
              <th>Name:</th>
              <td className="flex flex-row justify-between items-center">
                {editing === "name" ? (
                  <input
                    className="input input-md input-bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <span>{name}</span>
                )}
                <button
                  className="btn btn-square btn-sm flex-end"
                  onClick={() => handleEdit("name")}
                >
                  {editing === "name" ? (
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
                {editing === "phone" ? (
                  <input
                    type="input"
                    value={phone}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        setPhone(e.target.value);
                      }
                    }}
                  />
                ) : (
                  <span>
                    {phone.length ? phone : "Do not have Phone No. Yet."}
                  </span>
                )}
                <button
                  className="btn btn-square btn-sm flex-end"
                  onClick={() => handleEdit("phone")}
                >
                  {editing === "phone" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>Points:</th>
              <td>{levelInfo?.points}</td>
            </tr>
          </tbody>
        </table>
        {membershipDisplay}
      </div>
    </div>
  );
}
