import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Notice-Sub/NoticeSlide";

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

type suggestCategory = {
  products: product[];
  category: string;
};

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onsaleList, setOnsaleList] = useState<product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suggestLists, setSuggestLists] = useState<suggestCategory[]>([]);
  const { handleAddWishItem, handleAddCart } = useOutletContext<outletProps>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const onsaleRes = await axios.get(`${BACKENDURL}/product/onsale`);
        const categoryList: { data: string[] } = await axios.get(
          `${BACKENDURL}/category/all`
        );
        const randomIndexFirst = Math.floor(
          Math.random() * categoryList.data.length
        );
        let randomIndexSecond = Math.floor(
          Math.random() * categoryList.data.length
        );
        while (randomIndexFirst === randomIndexSecond) {
          randomIndexSecond = Math.floor(
            Math.random() * categoryList.data.length
          );
        }
        const random = [
          categoryList.data[randomIndexFirst],
          categoryList.data[randomIndexSecond],
        ];
        const rawSuggestList: suggestCategory[] = [];

        for (const category of random) {
          const products: { data: product[] } = await axios.get(
            `${BACKENDURL}/category/suggest/${category}`
          );
          rawSuggestList.push({ category: category, products: products.data });
        }
        setSuggestLists(rawSuggestList);
        setCategories(categoryList.data);
        setOnsaleList(onsaleRes.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const suggestDisplay = suggestLists.map((item) => {
    return (
      <div key={`suggest${item.category}`}>
        <h1 className="w-5/6 text-xl">{item.category}:</h1>
        <ProductList
          products={item.products}
          handleAddWishItem={handleAddWishItem}
          handleAddCart={handleAddCart}
        />
      </div>
    );
  });

  const categoriesDisplay = categories.map((name) => (
    <Link
      className="btn btn-link w-1/2"
      to={`search?category=${name}`}
      key={name}
    >
      {name}
    </Link>
  ));

  return (
    <div className="min-h-screen">
      <NoticeSlide />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className=" flex flex-col items-center">
          <h1 className="w-5/6 text-xl">On Sales:</h1>
          <ProductList
            products={onsaleList}
            handleAddWishItem={handleAddWishItem}
            handleAddCart={handleAddCart}
          />
          {suggestDisplay}
          <h1 className="w-5/6 text-lg ">Categories:</h1>
          <div className="flex flex-row w-5/6 flex-wrap">
            {categoriesDisplay}
          </div>
        </div>
      )}
    </div>
  );
}
