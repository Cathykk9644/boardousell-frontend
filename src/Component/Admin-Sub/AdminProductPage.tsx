import { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { BACKENDURL } from "../../constant";
import axios from "axios";
import ProductEditForm from "./AdminProduct/ProductEditForm";
import ProductAddForm from "./AdminProduct/ProductAddForm";
import { category } from "../../type";
import { product } from "../../type";

type key = "all" | "name" | "stock" | "category";

type search = {
  type: key;
  input: string;
} | null;

export default function AdminProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<product[]>([]);
  const [type, setType] = useState<key>("name");
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [open, setOpen] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newAddedProducts, setNewAddedProducts] = useState<product[]>([]);
  const [currentSearch, setCurrentSearch] = useState<search>(null);
  const [errMsg, setErrMsg] = useState("");

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
        setSelectedCategory(data[0]);
        setIsLoading(false);
      } catch (error) {
        setErrMsg("Cannot Load all categories");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      switch (type) {
        case "all":
          const allDataRes = await axios.get(
            `${BACKENDURL}/product/admin/all/1`
          );
          setTotalPage(Math.ceil(allDataRes.data.count / 5));
          setProducts(allDataRes.data.data);
          break;
        case "name":
          if (!searchInput.length) {
            throw new Error("Please Enter Keyword.");
          }
          const nameDataRes = await axios.get(
            `${BACKENDURL}/product/admin/name/${searchInput}/1`
          );
          setTotalPage(Math.ceil(nameDataRes.data.count / 5));
          setProducts(nameDataRes.data.data);
          break;
        case "stock":
          if (!searchInput.length) {
            throw new Error("Please Enter Amount/LowerLimit-UpperLimit.");
          }
          const stockDataRes = await axios.get(
            `${BACKENDURL}/product/admin/stock/${searchInput}/1`
          );
          setTotalPage(Math.ceil(stockDataRes.data.count / 5));
          setProducts(stockDataRes.data.data);
          break;
        case "category":
          const categoryDataRes = await axios.get(
            `${BACKENDURL}/product/admin/category/${selectedCategory}/1`
          );
          setTotalPage(Math.ceil(categoryDataRes.data.count / 5));
          setProducts(categoryDataRes.data.data);
          break;
        default:
          throw new Error("No Search Found.");
      }
      setCurrentPage(1);
      setCurrentSearch({
        type: type,
        input: type === "category" ? selectedCategory : searchInput,
      });
      setSearchInput("");
      setNewAddedProducts([]);
      setIsLoading(false);
      setErrMsg("");
    } catch (error: any) {
      setErrMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleChangePage = async (
    e: React.ChangeEvent<unknown>,
    page: number
  ) => {
    try {
      setIsLoading(true);
      switch (currentSearch?.type) {
        case "all":
          const allDataRes = await axios.get(
            `${BACKENDURL}/product/admin/all/${page}`
          );
          setProducts(allDataRes.data.data);
          break;
        default:
          const { data } = await axios.get(
            `${BACKENDURL}/product/admin/${currentSearch?.type}/${currentSearch?.input}/${page}`
          );
          setProducts(data.data);
      }
      setCurrentPage(page);
      setIsLoading(false);
      setErrMsg("");
    } catch (error: any) {
      setErrMsg(error.message);
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
        <span className="text-md">Products:</span>
        <select
          value={type}
          className="select select-sm select-bordered"
          onChange={(e) => setType(e.target.value as key)}
        >
          <option value="all">All</option>
          <option value="name">Name</option>
          <option value="stock">stock</option>
          <option value="category">Category</option>
        </select>
        {(type === "stock" || type === "name") && (
          <input
            className="input input-bordered input-sm w-full"
            value={searchInput}
            placeholder={type === "stock" ? "1 or 10-20" : ""}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        )}
        {type === "category" && (
          <select
            value={selectedCategory}
            className="select select-sm select-bordered"
            onChange={(e) => setSelectedCategory(e.target.value)}
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
        {!!totalPage && (
          <Pagination
            count={totalPage}
            page={currentPage}
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
