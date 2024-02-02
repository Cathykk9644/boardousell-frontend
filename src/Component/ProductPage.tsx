import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKENDURL } from "../constant";

type params = {
  productId: string;
};

type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  onsale?: {
    discount: number;
  };
} | null;
export default function ProductPage() {
  const { productId } = useParams();
  const [productInfo, setProductInfo] = useState<product>(null);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  console.log(productInfo);
  console.log(photoList);
  console.log(categoryList);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BACKENDURL}/product/info/${productId}`
        );
        const { productPhotos, categories, ...product } = data;
        setProductInfo(product);
        const flatPhotoList = productPhotos.map(
          (item: { url: string }) => item.url
        );
        setPhotoList(flatPhotoList);
        const flatCategoryList = categories.map(
          (item: { name: string }) => item.name
        );
        setCategoryList(flatCategoryList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [productId]);

  return (
    <div className="min-h-screen">
      <div></div>
    </div>
  );
}
