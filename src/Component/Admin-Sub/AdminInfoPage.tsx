import { useEffect, useState } from "react";

type info = {
  id: number;
  name: "Phone" | "Link" | "Email" | "Map";
  detail: string;
};

//Only Need Add and Delete
export default function AdminInfoPage() {
  const [infos, setInfos] = useState<info[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);

  const infoDisplay = infos.map((info) => {
    return <div></div>;
  });

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
      <div className="flex flex-col items-center w-5/6">{infoDisplay}</div>
    </div>
  );
}
