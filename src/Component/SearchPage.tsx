import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BACKENDURL } from "../constant";

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BACKENDURL}/product/search${location.search}`
        );
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [location]);
  return <div></div>;
}
