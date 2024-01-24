import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
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
      url: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
} | null;

type products = product[] | null;

export default function ProductList() {
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
  return <ProductCard product={!!newProducts ? newProducts[0] : null} />;
}
