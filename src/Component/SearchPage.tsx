import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    console.log(key, value);
  }
  return <div></div>;
}
