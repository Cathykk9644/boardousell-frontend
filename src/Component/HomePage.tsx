import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Notice-Sub/NoticeSlide";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import { product, outletProps } from "../type";

export default function HomePage(): JSX.Element {
  const [newProducts, setNewProduct] = useState<product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleAddItem, setError }: outletProps = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productDataRes = await axios.get(`${BACKENDURL}/product/new`);
        setNewProduct(productDataRes.data);
        setIsLoading(false);
      } catch (error) {
        setError({
          backHome: false,
          message: "Oh. Somethings went wrong. Cannot load products.",
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setError]);

  return (
    <div className="flex flex-col">
      <NoticeSlide setError={setError} />
      <h1 className="m-2 text-2xl">New arrived:</h1>
      {isLoading ? (
        <CircularProgress className="self-center" />
      ) : (
        <ProductList products={newProducts} handleAddItem={handleAddItem} />
      )}
    </div>
  );
}
