import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKENDURL } from "../../constant";

type category = {
  id: number;
  name: string;
};

export default function AdminCategoryPage() {
  const [input, setInput] = useState<string>("");
  const [categories, setCategories] = useState<category[]>([]);
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

  console.log(categories);

  const categoryDisplay = categories.map((category) => {
    return (
      <tr key={category.id}>
        <th></th>
        <td></td>
      </tr>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
        <CircularProgress />
      </Backdrop>
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}

      <div className="">
        <table className="table">
          <thead>
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
          </thead>
        </table>
      </div>
    </div>
  );
}
