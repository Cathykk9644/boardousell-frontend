import { useState } from "react";

export default function AdminMembershipPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
    </div>
  );
}
