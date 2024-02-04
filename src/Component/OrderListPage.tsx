import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import { Stack } from "@mui/material";
type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
  setError: Function;
};
type order = {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function OrderListPage() {
  const { userId, setError } = useOutletContext<outletProps>();
  const [orderList, setOrderList] = useState<order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/order/all/${userId}`);
        setOrderList(data);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Sorry, cannot load your order list for now.",
        });
      }
    };
    fetchData();
  }, [userId, setError]);

  const orderListDisplay = orderList.map((order) => {
    const createdTimestamp = order ? Date.parse(order.createdAt) : 0;
    const createdDate = new Date(createdTimestamp);
    const updatedTimestamp = order ? Date.parse(order.updatedAt) : 0;
    const updatedDate = new Date(updatedTimestamp);
    return (
      <div className="card w-96 bg-base-200 shadow-xl" key={order.id}>
        <div className="card-body">
          <div className="card-title flex justify-between mb-5">
            <h1>Order ID: {order.id}</h1>
            <h1>Status : {order.status}</h1>
          </div>
          <div className="flex flex-col">
            <span>Order Date: {createdDate.toLocaleString()}</span>
            <span> </span>
            <span>Last Update: {updatedDate.toLocaleString()}</span>
            <span></span>
            <span></span>
          </div>
          <div className="mt-5 card-actions justify-between items-center">
            <b className="text-lg">Amount: ${order.amount}</b>
            <Link to={`/order/${order.id}`} className="btn btn-outline">
              Detail
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <Stack spacing={2} className="my-5">
        {orderListDisplay}
      </Stack>
    </div>
  );
}
