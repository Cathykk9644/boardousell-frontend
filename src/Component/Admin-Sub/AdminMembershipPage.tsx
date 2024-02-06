import { useEffect, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { BACKENDURL } from "../../constant";

type level = {
  id: number;
  title: string;
  requirement: number;
  discount: number;
};

type updatedLevel = {
  id: number;
  title: string;
  requirement?: number;
  discount: number;
};
export default function AdminMembershipPage() {
  const [levels, setLevels] = useState<level[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [editId, setEditId] = useState<number | "new" | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editRequire, setEditRequire] = useState<string>("");
  const [editDiscount, setEditDiscount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${BACKENDURL}/level`);
        setLevels(data);
        setIsLoading(false);
      } catch (error: any) {
        setErrMsg(error.message);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { data } = await axios.delete(`${BACKENDURL}/level/${id}`);
      setLevels(data);
      setErrMsg("");
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  const handleConfirmAdd = async () => {
    try {
      const newData = {
        title: editTitle,
        discount: Number(editDiscount),
        requirement: Number(editRequire),
      };
      const { data } = await axios.post(`${BACKENDURL}/level`, newData);
      setLevels(data);
      setErrMsg("");
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  const handleConfirmUpdate = async (
    id: number,
    originalRequirement: string
  ) => {
    try {
      const newData: updatedLevel = {
        id: id,
        title: editTitle,
        discount: Number(editDiscount),
      };
      if (originalRequirement !== editRequire) {
        newData.requirement = Number(editRequire);
      }
      const { data } = await axios.put(`${BACKENDURL}/level`, newData);
      setLevels(data);
      setErrMsg("");
    } catch (error: any) {
      setErrMsg(error.message);
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
      setEditTitle(title);
      setEditRequire(requirement);
      setEditDiscount(discount);
      return;
    }
    if (editId === "new") {
      handleConfirmAdd();
    } else handleConfirmUpdate(editId, requirement);
    setEditId(null);
    setEditTitle("");
    setEditRequire("");
    setEditDiscount("");
  };
  const levelDisplay = levels.map((level) => {
    const isEditing = editId === level.id;
    return (
      <tr key={level.id}>
        {isEditing ? (
          <td>
            <input
              className="input input-sm w-full input-bordered"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
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
              value={editRequire}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value)))
                  setEditRequire(e.target.value);
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
              value={editDiscount}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value)))
                  setEditDiscount(e.target.value);
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
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
      <div className="w-5/6">
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
                    value={editTitle}
                    onChange={(e) => {
                      setEditTitle(e.target.value);
                    }}
                  />
                )}
              </th>
              <th>
                {isAdding && (
                  <input
                    className="input input-sm w-full input-bordered"
                    value={editRequire}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value)))
                        setEditRequire(e.target.value);
                    }}
                  />
                )}
              </th>
              <th>
                {isAdding && (
                  <input
                    className="input input-sm w-full input-bordered"
                    value={editDiscount}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value)))
                        setEditDiscount(e.target.value);
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
