import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Sub-Component/NoticeSlide";
import { useEffect, useState } from "react";
import axios from "axios";
import ShoppingCart from "./Sub-Component/ShoppingCart";
import Wishlist from "./Sub-Component/Wishlist";
import { useOutletContext } from "react-router-dom";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type product = {
  price: number;
  name: string;
  stocks: number;
  productPhotos: [
    {
      url?: string;
    }
  ];
} | null;

type products = product[] | null;

export default function HomePage() {
  const [newProducts, setNewProduct] = useState<products>(null);
  const userEmail: string = useOutletContext();

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
      <h1 className="ml-2">New arrived:</h1>
      <ProductList products={newProducts} />
      <Wishlist userEmail={userEmail} />
      <ShoppingCart userEmail={userEmail} />
    </div>
  );
}
