import { useEffect, useState } from "react";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { order } from "../../type";

type search = {
  type: "status" | "message" | "email" | "id" | "product";
  input: string;
};

//Search for Status order,
//Search for message in created order,
//Search using user email
//Search using order Id
//Search using product
export default function AdminOrderPage() {
  const [orders, setOrders] = useState<order[]>([]);
  const [search, setSearch] = useState<search>({ type: "status", input: "" });
  const [keyword, setKeyword] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);

  const handleChangeSearchType = (newType: search["type"]) => {
    let newInput = search.input;
    if (search.type === "status" || search.type === "message") {
      newInput = "";
    }
    switch (newType) {
      case "id":
        if (isNaN(Number(search.input))) {
          newInput = "";
        }
        break;
      case "status":
        newInput = "Pending";
        break;
      case "message":
        newInput = "DESC";
        break;
    }
    setSearch({ type: newType, input: newInput });
  };

  const handleChangeInput = (val: string) => {
    if (!(search.type === "id" && isNaN(Number(val)))) {
      setSearch({ ...search, input: val });
    }
  };

  const handleSearch = async () => {
    try {
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  console.log(search);
  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1">{errMsg}</span>}
      <div className="flex items-center justify-between w-full space-x-3">
        <select
          value={search.type}
          className="select select-sm select-bordered"
          onChange={(e) =>
            handleChangeSearchType(e.target.value as search["type"])
          }
        >
          <option value="status">Status</option>
          <option value="message">Message Time</option>
          <option value="email">Email</option>
          <option value="id">Order No.</option>
          <option value="product">Product</option>
        </select>
        {search.type === "status" || search.type === "message" ? (
          <select
            value={search.input}
            className="select select-sm select-bordered"
            onChange={(e) => handleChangeInput(e.target.value)}
          >
            {search.type === "message" && (
              <option value="ASC">Accending</option>
            )}
            {search.type === "message" && (
              <option value="DESC">Descending</option>
            )}
            {search.type === "status" && (
              <option value="Pending">Pending</option>
            )}
            {search.type === "status" && <option value="Paid">Paid</option>}
            {search.type === "status" && <option value="Ready">Ready</option>}
            {search.type === "status" && (
              <option value="Shipped">Shipped</option>
            )}
            {search.type === "status" && (
              <option value="Delivered">Delivered</option>
            )}
            {search.type === "status" && (
              <option value="Cancelled">Cancelled</option>
            )}
          </select>
        ) : (
          <input
            value={search.input}
            className="input input-bordered input-sm w-full"
            placeholder="All"
            onChange={(e) => handleChangeInput(e.target.value)}
          />
        )}
        <button className="btn btn-md btn-square " onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
    </div>
  );
}
