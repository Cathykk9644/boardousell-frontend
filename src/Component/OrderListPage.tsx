import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
import { Stack } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { order, outletProps } from "../type";

export default function OrderListPage() {
  const { userId, setError } = useOutletContext<outletProps>();
  const [orderList, setOrderList] = useState<order[]>([]);
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      loginWithRedirect();
    }
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
    if (userId) {
      fetchData();
    }
  }, [userId, setError, isAuthenticated, loginWithRedirect, isLoading]);

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
    <div className="flex flex-col items-center min-h-screen">
      {orderList.length ? (
        <Stack spacing={2} className="my-5">
          {orderListDisplay}
        </Stack>
      ) : (
        <div className="m-5 flex flex-col items-center space-y-5">
          <span className="text-xl">You do not have any order yet.</span>
          <span>Please explore out products.😊</span>
          <Link to="../explore" className="btn btn-lg btn-accent">
            Go explore!
          </Link>
        </div>
      )}
    </div>
  );
}
