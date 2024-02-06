import { useState } from "react";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");

  const handleSearch = () => {
    try {
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };
  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
      <div className="flex items-center justify-center">
        <span className="text-md">Search Orders:</span>
        <input
          className="input input-bordered input-md mx-3"
          placeholder="All"
        />
        <button className="btn btn-md btn-square " onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
    </div>
  );
}
