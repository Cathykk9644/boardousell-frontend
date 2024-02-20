import { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { BACKENDURL } from "../../constant";
import axios from "axios";
import ProductEditForm from "./AdminProduct/ProductEditForm";
import ProductAddForm from "./AdminProduct/ProductAddForm";
import { category } from "../../type";
import { product } from "../../type";
import { useAuth0 } from "@auth0/auth0-react";

type key = "all" | "name" | "stock" | "category";

type search = {
  type: key;
  input: string;
};

type page = {
  total: number;
  current: number;
};

export default function AdminProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<product[]>([]);
  const [currentSearch, setCurrentSearch] = useState<search | null>(null);
  const [page, setPage] = useState<page>({ total: 0, current: 0 });
  const [search, setSearch] = useState<search>({ type: "name", input: "" });
  const [open, setOpen] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newAddedProducts, setNewAddedProducts] = useState<product[]>([]);
  const [errMsg, setErrMsg] = useState<string>("");
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${BACKENDURL}/category/all`);
        const flattenData = data.map((category: category) => category.name);
        setCategories(flattenData);
        setErrMsg("");
        setIsLoading(false);
      } catch (err) {
        setErrMsg("Oh. Somethings went wrong. Cannot load categories");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangeSearchType = async (newType: key) => {
    switch (newType) {
      case "category":
        setSearch({ type: "category", input: categories[0] });
        break;
      case "stock":
        setSearch({
          type: "stock",
          input: isNaN(Number(search.input)) ? "" : search.input,
        });
        break;
      default:
        setSearch({ type: newType, input: search.input });
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      let res;
      switch (search.type) {
        case "all":
          res = await axios.get(`${BACKENDURL}/admin/product/all/1`, config);
          break;
        case "name":
          if (!search.input.length) {
            return setErrMsg("Please Enter Keyword.");
          }
          res = await axios.get(
            `${BACKENDURL}/admin/product/name/${search.input}/1`,
            config
          );
          break;
        case "stock":
          if (!search.input.length) {
            return setErrMsg("Please Enter Amount/LowerLimit-UpperLimit.");
          }
          const checking = search.input.split("-");
          if (checking.length > 2) {
            return setErrMsg("Please Enter Amount/LowerLimit-UpperLimit.");
          }
          if (isNaN(Number(checking[0])) || !checking[0].length) {
            return setErrMsg("Please Enter Amount/LowerLimit-UpperLimit.");
          }
          if (
            checking.length === 2 &&
            (!checking[1].length || isNaN(Number(checking[1])))
          ) {
            return setErrMsg("Please Enter Amount/LowerLimit-UpperLimit.");
          }
          res = await axios.get(
            `${BACKENDURL}/admin/product/stock/${search.input}/1`,
            config
          );
          break;
        case "category":
          res = await axios.get(
            `${BACKENDURL}/admin/product/category/${search.input}/1`,
            config
          );
          break;
        default:
          return setErrMsg("No Search Found.");
      }
      setPage({
        total: Math.ceil(res.data.count / 5),
        current: 1,
      });
      setProducts(res.data.data);
      setCurrentSearch({ ...search });
      setNewAddedProducts([]);
      setIsLoading(false);
      setErrMsg("");
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot search product");
      setIsLoading(false);
    }
  };

  const handleChangePage = async (
    e: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      switch (currentSearch?.type) {
        case "all":
          const allDataRes = await axios.get(
            `${BACKENDURL}/admin/product/all/${newPage}`
          );
          setProducts(allDataRes.data.data);
          break;
        default:
          const { data } = await axios.get(
            `${BACKENDURL}/admin/product/${currentSearch?.type}/${currentSearch?.input}/${newPage}`,
            config
          );
          setProducts(data.data);
      }
      setPage({ current: newPage, total: page.total });
      setIsLoading(false);
      setErrMsg("");
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot change page.");
      setIsLoading(false);
    }
  };

  const option = categories.map((category) => {
    return (
      <option value={category} key={category}>
        {category}
      </option>
    );
  });

  const productDisplay = products.length ? (
    products.map((product) => (
      <div className="w-full my-2" key={product.id}>
        <ProductEditForm
          product={product}
          categories={categories}
          open={open === product.id}
          setOpen={setOpen}
          setErrMsg={setErrMsg}
          setProducts={setProducts}
        />
      </div>
    ))
  ) : (
    <div>No Products Found.</div>
  );

  const newProductDisplay = newAddedProducts
    ? newAddedProducts.map((product) => (
        <div className="w-full my-2" key={product.id}>
          <ProductEditForm
            product={product}
            categories={categories}
            open={open === product.id}
            setOpen={setOpen}
            setErrMsg={setErrMsg}
            setProducts={setNewAddedProducts}
          />
        </div>
      ))
    : null;

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1">{errMsg}</span>}
      <div className="flex items-center justify-between w-full space-x-3">
        <select
          value={search.type}
          className="select select-sm select-bordered"
          onChange={(e) => handleChangeSearchType(e.target.value as key)}
        >
          <option value="all">All</option>
          <option value="name">Name</option>
          <option value="stock">stock</option>
          <option value="category">Category</option>
        </select>
        {search.type === "name" && (
          <input
            className="input input-bordered input-sm w-full"
            value={search.input}
            onChange={(e) =>
              setSearch({ type: search.type, input: e.target.value })
            }
          />
        )}
        {search.type === "stock" && (
          <input
            className="input input-bordered input-sm w-full"
            value={search.input}
            placeholder={"1 or 10-20"}
            onChange={(e) => {
              setSearch({ type: search.type, input: e.target.value });
            }}
          />
        )}
        {search.type === "category" && (
          <select
            value={search.input}
            className="select select-sm select-bordered"
            onChange={(e) =>
              setSearch({ type: search.type, input: e.target.value })
            }
          >
            {option}
          </select>
        )}

        <button className="btn btn-md btn-square" onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <div className="w-5/6 flex flex-col items-center">
        {isLoading ? <CircularProgress /> : productDisplay}
        {!!page.total && (
          <Pagination
            count={page.total}
            page={page.current}
            variant="outlined"
            shape="rounded"
            onChange={handleChangePage}
          />
        )}
      </div>
      <ProductAddForm
        open={isAdding}
        categories={categories}
        setIsAdding={setIsAdding}
        setNewAddedProducts={setNewAddedProducts}
      />
      <button
        className="btn btn-wide btn-outline my-5"
        onClick={() => setIsAdding(true)}
      >
        Add Product
      </button>
      <div className="w-5/6 flex flex-col items-center">
        {!!newAddedProducts.length && <h1>New Added Products:</h1>}
        {newProductDisplay}
      </div>
    </div>
  );
}
