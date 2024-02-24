import axios from "axios";
import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { BACKENDURL } from "../constant";
import noImage from "./img/no-image.jpg";
import { Pagination } from "@mui/material";
import { product, outletProps } from "../type";
type res = {
  amount: number;
  data: product[];
};

export default function SearchPage(): JSX.Element {
  const [products, setProducts] = useState<product[]>([]);
  const [resultAmount, setResultAmount] = useState<number>(0);
  const [query] = useSearchParams();
  const { handleAddItem, setError } = useOutletContext<outletProps>();
  const navi = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }: { data: res } = await axios.get(
          `${BACKENDURL}/product/search?${query.toString()}`
        );
        setProducts(data.data);
        setResultAmount(data.amount);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot search.",
        });
      }
    };
    fetchData();
  }, [query, setError]);

  const handleChange = (e: React.ChangeEvent<unknown>, newPage: number) => {
    let queryString = "?";
    query.forEach((value, key) => {
      if (key !== "page") {
        queryString += `${key}=${value}&`;
      }
    });
    queryString += `&page=${newPage}`;
    navi("../search" + queryString);
  };

  const resultDisplay = products.map((product) => {
    return (
      <div
        className="card card-side bg-base-300 shadow-xl my-5 max-w-full p-3"
        key={product.name}
      >
        <Link to={`/product/${product.id}`}>
          <img
            className="object-contain w-1/2 sm:h-44"
            src={
              product.productPhotos[0] ? product.productPhotos[0].url : noImage
            }
            alt={product.name}
          />
        </Link>
        <div className="card-body p-5">
          <Link to={`/product/${product.id}`}>
            <h1 className="card-title">{product.name}</h1>
          </Link>
          <div className="flex flex-col my-3">
            <div>
              Price: HKD${" "}
              <span className={product.onsale && "line-through"}>
                {product.price}
              </span>{" "}
              {product.onsale &&
                ` ${Math.round(product.price * product.onsale.discount)}`}
            </div>
            <div>stock: {product.stock}</div>
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn btn-square btn-md"
              onClick={() => handleAddItem(product.id, "wishlist")}
            >
              <StarsIcon />
            </button>
            <button
              className="btn btn-square btn-md"
              disabled={!product.stock}
              onClick={() => handleAddItem(product.id, "cart")}
            >
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-5/6 flex flex-col ">
        <h1 className="text-xl">{resultAmount} results found: </h1>
        {query.has("category") && <h1>Category: {query.get("category")}</h1>}
        {query.has("keyword") && <h1>Keyword: {query.get(`keyword`)}</h1>}
        {resultDisplay}
      </div>
      <Pagination
        count={Math.ceil(resultAmount / 5)}
        variant="outlined"
        color="primary"
        onChange={handleChange}
      />
    </div>
  );
}
