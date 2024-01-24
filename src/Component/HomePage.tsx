import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Sub-Component/NoticeSlide";
import { useEffect, useState } from "react";
import axios from "axios";
const BACKENDURL = process.env.REACT_APP_BACKEND;

type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  createdAt: Date;
  updatedAt: Date;
  newproduct: {
    id: number;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
  };
  productPhotos: [
    {
      id: number;
      productId: number;
      url?: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
} | null;

type products = product[] | null;

export default function HomePage() {
  const [newProducts, setNewProduct] = useState<products>(null);

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
    </div>
  );
}
