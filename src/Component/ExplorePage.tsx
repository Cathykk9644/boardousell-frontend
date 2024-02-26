import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { BACKENDURL } from "../constant";
import { outletProps, product, category } from "../type";
import ProductListForSearch from "./Sub-Component/ProductListForSearch";

type page = {
  current: number;
  total: number;
};

const resultPerPage = 9;
export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<product[]>([]);
  const [page, setPage] = useState<page>({ current: 0, total: 0 });
  const [categories, setCategories] = useState<category[]>([]);
  const { handleAddItem, setError } = useOutletContext<outletProps>();
  const [query] = useSearchParams();
  let queryPage = query.get("page");
  if (!queryPage) {
    queryPage = "1";
  }
  const queryCategory = query.get("category");
  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data }: { data: category[] } = await axios.get(
          `${BACKENDURL}/category`
        );

        switch (queryCategory) {
          case null:
            const allData = await axios.get(
              `${BACKENDURL}/product/search?limit=${resultPerPage}&page=${queryPage}`
            );
            setProducts(allData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(allData.data.amount / resultPerPage),
            });
            break;
          case "sale":
            const salesData = await axios.get(
              `${BACKENDURL}/product/onsale?limit=${resultPerPage}&page=${queryPage}`
            );
            setProducts(salesData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(salesData.data.amount / resultPerPage),
            });
            break;
          case "new":
            const newData = await axios.get(
              `${BACKENDURL}/product/new?limit=${resultPerPage}&page=${queryPage}`
            );
            setProducts(newData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(newData.data.amount / resultPerPage),
            });
            break;
          default:
            const queryCategoryIdIndex = data.findIndex(
              (target) => queryCategory === target.name
            );
            const categoryData = await axios.get(
              `${BACKENDURL}/product/category/${data[queryCategoryIdIndex].id}?limit=${resultPerPage}&page=${queryPage}`
            );
            setProducts(categoryData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(categoryData.data.amount / resultPerPage),
            });
            break;
        }
        setCategories(data);
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
  }, [setError, queryPage, queryCategory]);

  const categoriesDisplay = categories.map((category) => (
    <button
      className={`btn btn-sm w-max m-1 ${
        queryCategory === category.name && "btn-neutral"
      }`}
      key={category.id}
      onClick={() => handleChangeExplore(category.name)}
    >
      {category.name}
    </button>
  ));

  const handleChangeExplore = (category: string | null) => {
    if (category === queryCategory) {
      return;
    }
    if (!category) {
      return navi(`/explore`);
    }
    navi(`/explore?category=${category}`);
  };

  const handleChangePage = (newPage: number) => {
    navi(
      `/explore?${
        queryCategory ? `category=${queryCategory}&` : ""
      }page=${newPage}`
    );
  };

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-between w-4/6 items-center">
            <div className="space-x-4">
              <button
                className={`btn rounded-full ${
                  !queryCategory && "btn-neutral"
                }`}
                onClick={() => handleChangeExplore(null)}
              >
                All Products
              </button>
              <button
                className={`btn rounded-full ${
                  queryCategory === "new" && "btn-neutral"
                }`}
                onClick={() => handleChangeExplore("new")}
              >
                New Arrivals
              </button>
              <button
                className={`btn rounded-full ${
                  queryCategory === "sale" && "btn-neutral"
                }`}
                onClick={() => handleChangeExplore("sale")}
              >
                On Sales
              </button>
            </div>
            <details className="dropdown">
              <summary className="underline font-bold cursor-pointer">
                Sort by Categories
              </summary>
              <div className="dropdown-content bg-primary z-50 rounded p-1">
                {categoriesDisplay}
              </div>
            </details>
          </div>
          <ProductListForSearch
            handleAddItem={handleAddItem}
            page={page}
            handleChangePage={handleChangePage}
            products={products}
          />
        </div>
      )}
    </div>
  );
}
