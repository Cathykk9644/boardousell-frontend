import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
const BACKENDURL = process.env.REACT_APP_BACKEND;

interface product {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  createdAt: Date;
  updatedAt: Date;
}
interface rawProductData {
  id: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
  product: product;
}

type products = product[] | null;

export default function ProductList() {
  const [newProducts, setNewProduct] = useState<products>(null);
  console.log(newProducts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawProductDataRes = await axios.get(
          BACKENDURL + `/product/newProduct`
        );
        const productData = rawProductDataRes.data.map(
          (rawProductData: rawProductData) => rawProductData.product
        );
        setNewProduct(productData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return <ProductCard />;
}
