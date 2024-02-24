import { useEffect, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { order } from "../../type";
import { CircularProgress, Pagination } from "@mui/material";
import OrderEditForm from "./AdminOrder/OrderEditForm";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { useAuth0 } from "@auth0/auth0-react";

type search = {
  type: "status" | "id" | "message" | "email" | "product";
  input: string;
};
type page = {
  total: number;
  current: number;
};

const resultPerPage = 5;
export default function AdminOrderPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<order[]>([]);
  const [search, setSearch] = useState<search>({
    type: "status",
    input: "Pending",
  });
  const [currentSearch, setCurrentSearch] = useState<search>({
    type: "status",
    input: "Pending",
  });
  const [page, setPage] = useState<page>({ total: 0, current: 0 });
  const [expand, setExpand] = useState<number | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (errMsg.length) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errMsg]);

  const handleChangeSearchType = (newType: search["type"]) => {
    let newInput = search.input;
    if (search.type === "status" || search.type === "message") {
      newInput = "";
    }
    switch (newType) {
      case "id":
        if (isNaN(Number(search.input))) {
          newInput = "";
        }
        break;
      case "status":
        newInput = "Pending";
        break;
      case "message":
        newInput = "DESC";
        break;
    }
    setSearch({ type: newType, input: newInput });
  };

  const handleChangeInput = (val: string) => {
    if (!(search.type === "id" && isNaN(Number(val)))) {
      setSearch({ ...search, input: val });
    }
  };

  const getResult = async (
    type: search["type"],
    input: string,
    newPage: number
  ) => {
    const accessToken = await getAccessTokenSilently();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    if (type === "message") {
      const { data } = await axios.get(
        `${BACKENDURL}/admin/order/search?sort=${type}&order=${input}&limit=${resultPerPage}&page=${newPage}`,
        config
      );
      return { amount: data.amount, data: data.data };
    } else {
      const { data } = await axios.get(
        `${BACKENDURL}/admin/order/search?${type}=${input}&limit=${resultPerPage}&page=${newPage}`,
        config
      );
      return { amount: data.amount, data: data.data };
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const { amount, data } = await getResult(search.type, search.input, 1);
      setOrders(data);
      setPage({ total: Math.ceil(amount / 5), current: 1 });
      setCurrentSearch({ ...search });
      setIsLoading(false);
      setErrMsg("");
    } catch (err) {
      console.log(err);
      setErrMsg("Oh. Somethings went wrong. Cannot search orders.");
      setIsLoading(false);
    }
  };

  const handleChangePage = async (
    e: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    try {
      setIsLoading(true);
      const { data } = await getResult(
        currentSearch.type,
        currentSearch.input,
        newPage
      );
      setOrders(data);
      setPage({ ...page, current: newPage });
      setIsLoading(false);
      setErrMsg("");
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot change page.");
      setIsLoading(false);
    }
  };

  const ordersDisplay = orders.length ? (
    orders.map((order) => {
      return (
        <div className="w-full my-2" key={order.id}>
          <OrderEditForm
            order={order}
            open={expand === order.id}
            setExpand={setExpand}
            setOrders={setOrders}
            setErrMsg={setErrMsg}
          />
        </div>
      );
    })
  ) : (
    <div>No Orders Found.</div>
  );

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && <span className="text-error m-1">{errMsg}</span>}
      <div className="flex items-center justify-between w-full space-x-3">
        <select
          value={search.type}
          className="select select-sm select-bordered"
          onChange={(e) =>
            handleChangeSearchType(e.target.value as search["type"])
          }
        >
          <option value="status">Status</option>
          <option value="message">Message Time</option>
          <option value="email">Email</option>
          <option value="id">Order No.</option>
          <option value="product">Product</option>
        </select>
        {search.type === "status" || search.type === "message" ? (
          <select
            value={search.input}
            className="select select-sm select-bordered"
            onChange={(e) => handleChangeInput(e.target.value)}
          >
            {search.type === "message" && (
              <option value="ASC">Accending</option>
            )}
            {search.type === "message" && (
              <option value="DESC">Descending</option>
            )}
            {search.type === "status" && (
              <option value="Pending">Pending</option>
            )}
            {search.type === "status" && <option value="Paid">Paid</option>}
            {search.type === "status" && <option value="Ready">Ready</option>}
            {search.type === "status" && (
              <option value="Shipped">Shipped</option>
            )}
            {search.type === "status" && (
              <option value="Delivered">Delivered</option>
            )}
            {search.type === "status" && (
              <option value="Cancelled">Cancelled</option>
            )}
          </select>
        ) : (
          <input
            value={search.input}
            className="input input-bordered input-sm w-full"
            placeholder="All"
            onChange={(e) => handleChangeInput(e.target.value)}
          />
        )}
        <button className="btn btn-md btn-square " onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <div className="w-5/6 flex flex-col items-center">
        {isLoading ? <CircularProgress /> : ordersDisplay}
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
    </div>
  );
}
