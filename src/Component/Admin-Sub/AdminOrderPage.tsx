import { useEffect, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { order } from "../../type";
import { CircularProgress, Pagination } from "@mui/material";
import OrderEditForm from "./AdminOrder/OrderEditForm";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { useAuth0 } from "@auth0/auth0-react";

type search = {
  type: "status" | "message" | "email" | "id" | "product";
  input: string;
};
type page = {
  total: number;
  current: number;
};

export default function AdminOrderPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<order[]>([]);
  const [search, setSearch] = useState<search>({
    type: "status",
    input: "Pending",
  });
  const [currentSearch, setCurrentSearch] = useState<search | null>(null);
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

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      let count;
      let data;
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      switch (search.type) {
        case "id":
          const idRes = await axios.get(
            `${BACKENDURL}/admin/order/${search.input}`,
            config
          );
          count = idRes.data.count;
          data = idRes.data.data;
          break;
        case "message":
          const msgRes = await axios.get(
            `${BACKENDURL}/admin/order/message?page=1&sort=${search.input}`,
            config
          );
          count = msgRes.data.count;
          data = msgRes.data.data;
          break;
        default:
          const res = await axios.get(
            `${BACKENDURL}/admin/order/${search.type}?${search.type}=${search.input}&page=1`,
            config
          );
          count = res.data.count;
          data = res.data.data;
      }
      setOrders(data);
      setPage({ total: Math.ceil(count / 5), current: 1 });
      setCurrentSearch({ ...search });
      setIsLoading(false);
      setErrMsg("");
    } catch (err) {
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
      let data;
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      switch (currentSearch!.type) {
        case "message":
          const msgRes = await axios.get(
            `${BACKENDURL}/admin/order/message?page=${newPage}&sort=${
              currentSearch!.input
            }`,
            config
          );
          data = msgRes.data.data;
          break;
        default:
          const res = await axios.get(
            `${BACKENDURL}/admin/order/${currentSearch!.type}?${
              currentSearch!.type
            }=${currentSearch!.input}&page=${newPage}`,
            config
          );
          data = res.data.data;
      }
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
