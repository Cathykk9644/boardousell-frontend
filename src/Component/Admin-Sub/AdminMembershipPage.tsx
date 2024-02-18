import { useEffect, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { level } from "../../type";

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
        const { data } = await axios.get(`${BACKENDURL}/level`);
        setLevels(data);
        setIsLoading(false);
      } catch (error: any) {
        setErrMsg(error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(`${BACKENDURL}/level/${id}`);
      setLevels(data);
      setErrMsg("");
      setIsLoading(false);
    } catch (error: any) {
      setErrMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${BACKENDURL}/level`, editInput);
      setLevels(data);
      setErrMsg("");
      setIsLoading(false);
    } catch (error: any) {
      setErrMsg(error.message);
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
        const { data } = await axios.put(`${BACKENDURL}/level`, newData);
        setLevels(data);
      }
      setErrMsg("");
      setIsLoading(false);
    } catch (error: any) {
      setErrMsg(error.message);
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
              <th>Requirement:</th>
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
