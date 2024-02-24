import { useEffect, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { level } from "../../type";
import { useAuth0 } from "@auth0/auth0-react";

type editInput = {
  title: string;
  requirement: string;
  discount: string;
};

export default function AdminMembershipPage() {
  const [levels, setLevels] = useState<level[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [editId, setEditId] = useState<number | "new" | null>(null);
  const [editInput, setEditInput] = useState<editInput>({
    title: "",
    requirement: "",
    discount: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

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
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.get(`${BACKENDURL}/admin/level`, config);
        setLevels(data);
        setErrMsg("");
        setIsLoading(false);
      } catch (err) {
        setErrMsg("Oh. Somethings went wrong. Cannot load membership datas.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${BACKENDURL}/admin/level/${id}`, config);
      setLevels((prev: level[]) => prev.filter((target) => target.id !== id));
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot delete this level.");
      setIsLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    if (!editInput.requirement.length) {
      return setErrMsg("Must have requirement");
    }
    if (!editInput.discount.length) {
      return setErrMsg("Must have discount");
    }
    if (!editInput.title) {
      return setErrMsg("Must have title");
    }
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.post(
        `${BACKENDURL}/admin/level`,
        editInput,
        config
      );
      setLevels((prev) => [...prev, data]);
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot add this level.");
      setIsLoading(false);
    }
  };

  const handleConfirmUpdate = async (
    id: number,
    originalTitle: string,
    originalRequirement: string,
    originalDiscount: string
  ) => {
    try {
      let areAllUnchanged = true;
      const newData: {
        id: number;
        title?: string;
        requirement?: number;
        discount?: number;
      } = {
        id: id,
      };
      if (originalTitle !== editInput.title) {
        newData.title = editInput.title;
        areAllUnchanged = false;
      }
      if (originalRequirement !== editInput.requirement) {
        newData.requirement = Number(editInput.requirement);
        areAllUnchanged = false;
      }
      if (originalDiscount !== editInput.discount) {
        newData.discount = Number(editInput.discount);
      }
      if (!areAllUnchanged) {
        setIsLoading(true);
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.put(
          `${BACKENDURL}/admin/level`,
          newData,
          config
        );
        setLevels((prev: level[]) => {
          const newList = [...prev];
          const levelIndex = newList.findIndex((target) => target.id === id);
          newList[levelIndex] = data;
          return newList;
        });
      }
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update this level info.");
      setIsLoading(false);
    }
  };

  const handleEdit = (
    id: number | "new" | null,
    title: string,
    requirement: string,
    discount: string
  ) => {
    if (!editId) {
      setEditId(id);
      setEditInput({
        title: title,
        requirement: requirement,
        discount: discount,
      });
      return;
    }
    if (editId === "new") {
      handleConfirmAdd();
    } else handleConfirmUpdate(editId, title, requirement, discount);
    setEditId(null);
    setEditInput({ title: "", requirement: "", discount: "" });
  };

  levels.sort((a, b) => b.requirement - a.requirement);
  const levelDisplay = levels.map((level) => {
    const isEditing = editId === level.id;
    return (
      <tr key={level.id}>
        {isEditing ? (
          <td>
            <input
              className="input input-sm w-full input-bordered"
              value={editInput.title}
              onChange={(e) => {
                setEditInput((prev: editInput) => {
                  return { ...prev, title: e.target.value };
                });
              }}
            />
          </td>
        ) : (
          <td>{level.title}</td>
        )}
        {isEditing ? (
          <td>
            <input
              className="input input-sm w-full input-bordered"
              value={editInput.requirement}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value)))
                  setEditInput((prev: editInput) => {
                    return { ...prev, requirement: e.target.value };
                  });
              }}
            />
          </td>
        ) : (
          <td>{level.requirement}</td>
        )}
        {isEditing ? (
          <td>
            <input
              className="input input-sm w-full input-bordered"
              value={editInput.discount}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value)))
                  setEditInput((prev: editInput) => {
                    return { ...prev, discount: e.target.value };
                  });
              }}
            />
          </td>
        ) : (
          <td>{level.discount}</td>
        )}
        <td className="flex space-x-2">
          <button
            className="btn btn-square btn-sm"
            disabled={!!editId && !isEditing}
            onClick={() =>
              handleEdit(
                level.id,
                level.title,
                level.requirement.toString(),
                level.discount.toString()
              )
            }
          >
            {isEditing ? <DoneRoundedIcon /> : <EditRoundedIcon />}
          </button>
          <button
            className="btn btn-square btn-sm"
            disabled={!!editId && !isEditing}
            onClick={() => handleDelete(level.id)}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>
    );
  });

  const isAdding = editId === "new";
  return isLoading ? (
    <CircularProgress />
  ) : (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
      <div className="w-full sm:w-5/6">
        <table className="table">
          <thead>
            <tr>
              <th>Title:</th>
              <th>
                Upgrade
                <br />
                Requirement:
              </th>
              <th>Discount:</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{levelDisplay}</tbody>
          <tfoot>
            <tr>
              <th>
                {isAdding && (
                  <input
                    className="input input-sm w-full input-bordered"
                    value={editInput.title}
                    onChange={(e) => {
                      setEditInput((prev: editInput) => {
                        return { ...prev, title: e.target.value };
                      });
                    }}
                  />
                )}
              </th>
              <th>
                {isAdding && (
                  <input
                    className="input input-sm w-full input-bordered"
                    value={editInput.requirement}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value)))
                        setEditInput((prev: editInput) => {
                          return { ...prev, requirement: e.target.value };
                        });
                    }}
                  />
                )}
              </th>
              <th>
                {isAdding && (
                  <input
                    className="input input-sm w-full input-bordered"
                    value={editInput.discount}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value)))
                        setEditInput((prev: editInput) => {
                          return { ...prev, discount: e.target.value };
                        });
                    }}
                  />
                )}
              </th>
              <th>
                <button
                  className="btn btn-sm btn-outline w-full"
                  disabled={!!editId && !isAdding}
                  onClick={() => handleEdit("new", "", "", "")}
                >
                  {isAdding ? <DoneRoundedIcon /> : "Add"}
                </button>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
