import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Notice-Sub/NoticeSlide";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";

type outletProps = {
  handleAddWishItem: Function;
  handleAddCart: Function;
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
  const { handleAddWishItem, handleAddCart }: outletProps = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productDataRes = await axios.get(
          BACKENDURL + `/product/newProduct`
        );
        setNewProduct(productDataRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <NoticeSlide />
      <h1 className="m-2 text-2xl">New arrived:</h1>
      <ProductList
        products={newProducts}
        handleAddWishItem={handleAddWishItem}
        handleAddCart={handleAddCart}
      />
    </div>
  );
}
