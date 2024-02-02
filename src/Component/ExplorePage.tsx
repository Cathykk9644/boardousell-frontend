import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
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

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onsaleList, setOnsaleList] = useState<product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [productLists, setProductLists] = useState<product[][]>([]);
  const { handleAddWishItem, handleAddCart } = useOutletContext<outletProps>();
  console.log(onsaleList);
  console.log(categories);
  console.log(productLists);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${BACKENDURL}/category/explore`);
        const onsaleRes = await axios.get(`${BACKENDURL}/product/onsale`);
        setCategories(data.categories);
        setProductLists(data.productLists);
        setOnsaleList(onsaleRes.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  });
  return <div>Explore</div>;
}
