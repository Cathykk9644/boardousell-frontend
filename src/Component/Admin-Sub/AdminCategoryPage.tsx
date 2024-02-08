import { useEffect, useState } from "react";

export default function AdminCategoryPage() {
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);
  return <div></div>;
}
