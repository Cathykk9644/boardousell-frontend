import axios from "axios";
import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { BACKENDURL } from "../constant";
import noImage from "./img/no-image.jpg";
import { Pagination } from "@mui/material";

type product = {
  id: number;
  name: string;
  price: number;
  stocks: number;
  onsale?: {
    discount: number;
  };
  productPhotos: [{ url?: string }];
};
type res = {
  resultAmount: number;
  result: product[];
};
type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
  setError: Function;
};

export default function SearchPage() {
  const [products, setProducts] = useState<product[]>([]);
  const [resultAmount, setResultAmount] = useState<number>(0);
  const [query] = useSearchParams();
  const { handleAddCart, handleAddWishItem, setError } =
    useOutletContext<outletProps>();
  const navi = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }: { data: res } = await axios.get(
          `${BACKENDURL}/product/search?${query.toString()}`
        );
        setProducts(data.result);
        setResultAmount(data.resultAmount);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Sorry, somethings went wrong with the search.",
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
        <img
          className="object-contain w-1/2 sm:h-44"
          src={
            product.productPhotos[0] ? product.productPhotos[0].url : noImage
          }
          alt={product.name}
        />
        <div className="card-body p-5">
          <h1 className="card-title">{product.name}</h1>
          <div className="flex flex-col my-3">
            <div>
              Price: HKD${" "}
              <span className={product.onsale && "line-through"}>
                {product.price}
              </span>{" "}
              {product.onsale &&
                ` ${Math.round(product.price * product.onsale.discount)}`}
            </div>
            <div>Stocks: {product.stocks}</div>
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn btn-square btn-md"
              onClick={() => handleAddWishItem(product.id)}
            >
              <StarsIcon />
            </button>
            <button
              className="btn btn-square btn-md"
              disabled={!product.stocks}
              onClick={() => handleAddCart(product.id)}
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
