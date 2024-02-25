import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { BACKENDURL } from "../constant";
import { outletProps, product, category } from "../type";
import ProductListForSearch from "./Sub-Component/ProductListForSearch";

type page = {
  current: number;
  total: number;
};

const resultPerPage = 12;
export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<product[]>([]);
  const [page, setPage] = useState<page>({ current: 0, total: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const { handleAddItem, setError } = useOutletContext<outletProps>();
  const [query] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let queryPage = query.get("page");
        if (!queryPage) {
          queryPage = "1";
        }
        const queryCategoryId = query.get("category");
        switch (queryCategoryId) {
          case null:
            const allData = await axios.get(
              `${BACKENDURL}/product/search?limit=${resultPerPage}&page${queryPage}`
            );
            setProducts(allData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(allData.data.amount / resultPerPage),
            });
            break;
          case "onsale":
            const salesData = await axios.get(
              `${BACKENDURL}/product/onsale?limit=${resultPerPage}&page${queryPage}`
            );
            setProducts(salesData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(salesData.data.amount / resultPerPage),
            });
            break;
          case "new":
            const newData = await axios.get(
              `${BACKENDURL}/product/new/search?limit=${resultPerPage}&page${queryPage}`
            );
            setProducts(newData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(newData.data.amount / resultPerPage),
            });
            break;
          default:
            const categoryData = await axios.get(
              `${BACKENDURL}/product/category/${queryCategoryId}?limit=${resultPerPage}&page${queryPage}`
            );
            setProducts(categoryData.data.data);
            setPage({
              current: Number(queryPage),
              total: Math.ceil(categoryData.data.amount / resultPerPage),
            });
            break;
        }
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

  const categoriesDisplay = categories.map((name) => (
    <Link
      className="btn btn-link w-1/2"
      to={`/explore?category=${name}`}
      key={name}
    >
      {name}
    </Link>
  ));

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <ProductListForSearch
          handleAddItem={handleAddItem}
          products={products}
        />
      )}
    </div>
  );
}
