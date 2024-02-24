import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Notice-Sub/NoticeSlide";
import { outletProps, product, category } from "../type";

type suggestCategory = {
  products: product[];
  category: string;
};

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onsaleList, setOnsaleList] = useState<product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suggestLists, setSuggestLists] = useState<suggestCategory[]>([]);
  const { handleAddItem, setError } = useOutletContext<outletProps>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const categoryList: { data: category[] } = await axios.get(
          `${BACKENDURL}/category`
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
        const random: category[] = [
          categoryList.data[randomIndexFirst],
          categoryList.data[randomIndexSecond],
        ];
        const rawSuggestList: suggestCategory[] = [];

        for (const category of random) {
          const products: { data: { amount: number; data: product[] } } =
            await axios.get(
              `${BACKENDURL}/product/category/${category.id}?limit=12`
            );
          rawSuggestList.push({
            category: category.name,
            products: products.data.data,
          });
        }
        const flattenData = categoryList.data.map(
          (category: category) => category.name
        );
        const onsaleRes = await axios.get(`${BACKENDURL}/product/onsale`);
        setSuggestLists(rawSuggestList);
        setCategories(flattenData);
        setOnsaleList(onsaleRes.data);
        setIsLoading(false);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot load the product list.",
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setError]);

  const suggestDisplay = suggestLists.map((item) => {
    return (
      <div
        className="w-full flex flex-col items-center"
        key={`suggest${item.category}`}
      >
        <h1 className="w-5/6 text-xl ">{item.category}:</h1>
        <ProductList products={item.products} handleAddItem={handleAddItem} />
      </div>
    );
  });

  const categoriesDisplay = categories.map((name) => (
    <Link
      className="btn btn-link w-1/2"
      to={`/search?category=${name}`}
      key={name}
    >
      {name}
    </Link>
  ));

  return (
    <div className="min-h-screen">
      <NoticeSlide setError={setError} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className=" flex flex-col items-center">
          <h1 className="w-5/6 text-xl">On Sales:</h1>
          <ProductList products={onsaleList} handleAddItem={handleAddItem} />
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
