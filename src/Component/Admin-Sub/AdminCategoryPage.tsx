import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import { BACKENDURL } from "../../constant";
import CategoryLinkingForm from "./AdminCategory/CategoryLinkingForm";

type category = {
  id: number;
  name: string;
};

export default function AdminCategoryPage() {
  const [input, setInput] = useState<string>("");
  const [categories, setCategories] = useState<category[]>([]);
  const [linking, setLinking] = useState<category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

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
        const { data } = await axios.get(`${BACKENDURL}/category/admin/all`);
        setCategories(data);
        setErrMsg("");
        setIsLoading(false);
      } catch (error) {
        setErrMsg("Somethings went wrong, cannot load category");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`${BACKENDURL}/category/`, {
        name: input,
      });
      setCategories((prev) => [data, ...prev]);
      setInput("");
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Somethings went wrong, cannot load category");
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${BACKENDURL}/category/${categoryId}`);
      setCategories((prev) =>
        prev.filter((target) => target.id !== categoryId)
      );
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Somethings went wrong, cannot load category");
      setIsLoading(false);
    }
  };

  const categoryDisplay = categories.map((category) => {
    return (
      <tr key={category.id}>
        <th>{category.name}</th>
        <td className="space-x-2">
          <button
            className="btn btn-sm btn-square btn-outline"
            onClick={() => handleDeleteCategory(category.id)}
          >
            <DeleteIcon />
          </button>
          <button
            className="btn btn-sm btn-square btn-outline"
            onClick={() => setLinking(category)}
          >
            <InsertLinkRoundedIcon />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
      <div className="sm:w-1/2">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  className="input input-sm input-bordered"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </th>
              <th>
                <button
                  className="btn btn-sm btn-outline my-5"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
              </th>
            </tr>
            <tr>
              <th>Category:</th>
              <th>Actions:</th>
            </tr>
          </thead>
          <tbody>{categoryDisplay}</tbody>
        </table>
      </div>
      <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
        <CircularProgress />
      </Backdrop>
      {!!linking && (
        <CategoryLinkingForm category={linking} setLinking={setLinking} />
      )}
    </div>
  );
}
