import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import { BACKENDURL } from "../../constant";
import CategoryLinkingForm from "./AdminCategory/CategoryLinkingForm";
import { category } from "../../type";
import { useAuth0 } from "@auth0/auth0-react";

export default function AdminCategoryPage() {
  const [input, setInput] = useState<string>("");
  const [categories, setCategories] = useState<category[]>([]);
  const [linking, setLinking] = useState<category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
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
        const { data } = await axios.get(`${BACKENDURL}/category`);
        setCategories(data);
        setErrMsg("");
        setIsLoading(false);
      } catch (err) {
        setErrMsg("Oh. Somethings went wrong. Cannot load categories");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    if (!input.length) {
      return setErrMsg("Need name for the new category");
    }
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.put(
        `${BACKENDURL}/admin/category/`,
        {
          name: input,
        },
        config
      );
      setCategories((prev) => [data, ...prev]);
      setInput("");
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot add category.");
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${BACKENDURL}/admin/category/${categoryId}`, config);
      setCategories((prev) =>
        prev.filter((target) => target.id !== categoryId)
      );
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Oh. Somethings went wrong. Cannot delete category.");
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
