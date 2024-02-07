import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { BACKENDURL } from "../../constant";
import axios from "axios";

export default function AdminProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState([]);
  const [type, setType] = useState("name");
  const [keyword, setKeyword] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/category/all`);
        setCategories(data);
      } catch (error) {
        setErrMsg("Cannot Load all categories");
      }
    };
    fetchData();
  });

  const handleSearch = () => {
    try {
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  const productDisplay = <div></div>;

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
      <div className="flex items-center justify-between w-full space-x-3">
        <span className="text-md">Products:</span>
        <select
          value={type}
          className="select select-sm select-bordered"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="name">Name</option>
          <option value="stock">Stocks</option>
          <option value="category">Category</option>
        </select>
        {type !== "all" && (
          <input
            className="input input-bordered input-sm w-full"
            placeholder=""
            onChange={(e) => setKeyword(e.target.value)}
          />
        )}

        <button className="btn btn-md btn-square" onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <div className="w-5/6">
        {isLoading ? <CircularProgress /> : productDisplay}
      </div>
    </div>
  );
}
