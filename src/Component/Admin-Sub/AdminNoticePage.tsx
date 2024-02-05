import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function AdminNoticePage() {
  const [notices, setNotices] = useState([]);
  const [keyword, setKeyword] = useState<string>("");

  return (
    <div>
      <div className="flex items-center">
        <span className="text-md">Search Notices:</span>
        <input
          className="input input-bordered input-md mx-3"
          placeholder="All"
        />
        <button className="btn btn-md btn-square ">
          <SearchRoundedIcon />
        </button>
      </div>
    </div>
  );
}
