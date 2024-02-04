import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Notice-Sub/NoticeSlide";
import { CircularProgress } from "@mui/material";

import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";

type outletProps = {
  handleAddWishItem: Function;
  handleAddCart: Function;
  setError: Function;
};
type product = {
  id: number;
  price: number;
  name: string;
  stocks: number;
  onsale?: {
    discount: number;
  };
  productPhotos: [
    {
      url?: string;
    }
  ];
};
type products = product[];

export default function HomePage() {
  const [newProducts, setNewProduct] = useState<products>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleAddWishItem, handleAddCart, setError }: outletProps =
    useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productDataRes = await axios.get(
          BACKENDURL + `/product/newProduct`
        );
        setNewProduct(productDataRes.data);
        setIsLoading(false);
      } catch (error) {
        setError({
          backHome: false,
          message: "Oh. Somethings went wrong for now.",
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
        <ProductList
          products={newProducts}
          handleAddWishItem={handleAddWishItem}
          handleAddCart={handleAddCart}
        />
      )}
    </div>
  );
}
