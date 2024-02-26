import axios from "axios";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { BACKENDURL } from "../constant";
import { product, outletProps } from "../type";
import ProductListForSearch from "./Sub-Component/ProductListForSearch";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
type res = {
  amount: number;
  data: product[];
};

type page = {
  current: number;
  total: number;
};

const resultPerPage = 9;
export default function SearchPage(): JSX.Element {
  const [products, setProducts] = useState<product[]>([]);
  const [input, setInput] = useState<string>("");
  const [text, setText] = useState<string>(
    "Please search through the search bar above."
  );
  const [page, setPage] = useState<page>({ current: 0, total: 0 });
  const [query] = useSearchParams();
  const { handleAddItem, setError } = useOutletContext<outletProps>();
  const navi = useNavigate();
  let queryPage = query.get("page");
  if (!queryPage) {
    queryPage = "1";
  }
  const queryKeyword = query.get("keyword");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }: { data: res } = await axios.get(
          `${BACKENDURL}/product/search?keyword=${queryKeyword}&limit=${resultPerPage}&page=${queryPage}`
        );
        setProducts(data.data);
        setPage({
          current: Number(queryPage),
          total: Math.ceil(data.amount / resultPerPage),
        });
        setText(`Keyword "${queryKeyword}" found: ${data.amount} results`);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot search.",
        });
      }
    };
    if (queryKeyword) {
      fetchData();
    }
  }, [query, queryKeyword, queryPage, setError]);

  const handleSearch = () => {
    setInput("");
    if (!input.length) {
      return;
    }
    navi(`../search?keyword=${input}`);
  };

  const handleChangePage = (newPage: number) => {
    navi(`../search?keyword=${queryKeyword}&page=${newPage}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <label className="input input-bordered input-lg flex items-center rounded-full gap-2">
        <SearchRoundedIcon className="cursor-pointer" onClick={handleSearch} />
        <input
          type="text"
          className="grow"
          placeholder="E.g. Marvel Champion"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </label>
      {text}
      {queryKeyword && (
        <ProductListForSearch
          products={products}
          handleChangePage={handleChangePage}
          handleAddItem={handleAddItem}
          page={page}
        />
      )}
    </div>
  );
}
