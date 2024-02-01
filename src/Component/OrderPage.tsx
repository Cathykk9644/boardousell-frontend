import axios from "axios";
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  Link,
  Params,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { BACKENDURL } from "../constant";
import Payment from "./Payment-Sub/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY ? process.env.REACT_APP_STRIPE_KEY : ""
);

type order = {
  id: number;
  userId: number;
  address: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type user = {
  points: number;
  level: {
    title: string;
    requirement: number;
  };
};

type product = {
  id: number;
  name: string;
  productorder: {
    amount: number;
  };
};

type message = {
  id: number;
  isUserReceive: boolean;
  detail: string;
  createdAt: string;
  updatedAt: string;
};

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
};

export default function OrderPage() {
  const { orderId } = useParams<Params>();
  const [orderInfo, setOrderInfo] = useState<order>();
  const [userInfo, setUserInfo] = useState<user>();
  const [productList, setProductList] = useState<product[]>([]);
  const [messageList, setMessageList] = useState<message[]>([]);
  const [input, setInput] = useState<string>("");
  const [clientSecret, setClientSecret] = useState("");
  const navi = useNavigate();
  const { userId } = useOutletContext<outletProps>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/order/${orderId}`);
        if (!data || data.userId !== userId) {
          return navi(`/`);
        }
        const { user, products, messages, ...order } = data;
        setOrderInfo(order);
        setUserInfo(user);
        setProductList(products);
        messages.sort((a: message, b: message) => {
          return Date.parse(a.createdAt) - Date.parse(b.createdAt);
        });
        setMessageList(messages);
        const res = await axios.post(`${BACKENDURL}/payment`, {
          amount: order.amount,
        });
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [navi, orderId, userId]);

  const handleSendMessage = async () => {
    try {
      const { data } = await axios.post(`${BACKENDURL}/message`, {
        orderId,
        isUserReseived: false,
        detail: input,
      });
      setMessageList((prev) => [...prev, data]);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const productDisplay = productList.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Link to={`/product/${item.id}`} className="max-w-min">
            {item.name}
          </Link>
        </td>
        <td>x{item.productorder.amount}</td>
      </tr>
    );
  });

  const orderTimestamp = orderInfo ? Date.parse(orderInfo.createdAt) : 0;
  const date = new Date(orderTimestamp);
  const orderInfoDislay = (
    <table className="table m-2">
      <tbody>
        <tr>
          <th>Ordering Date:</th>
          <td>{date.toLocaleString()}</td>
        </tr>
        <tr>
          <th>Status:</th>
          <td>{orderInfo?.status}</td>
        </tr>
        <tr>
          <th>Shipping Address: </th>
          <td>{orderInfo?.address}</td>
        </tr>
      </tbody>
    </table>
  );

  const membershipDisplay = (
    <div className="m-5 flex flex-col">
      You are in {userInfo?.level.title} membership now.
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center">
          <progress
            className="w-3/5 progress progress-primary"
            value={userInfo?.points}
            max={userInfo?.level.requirement}
          />
          <span className="pl-1">
            {userInfo?.points}/{userInfo?.level.requirement}
          </span>
        </div>
        <div className="w-full flex items-center">
          <progress
            className="w-3/5 progress progress-secondary
            "
            value={
              (orderInfo ? orderInfo.amount : 0) +
              (userInfo ? userInfo.points : 0)
            }
            max={userInfo?.level.requirement}
          />
          <span className="pl-1">
            {(orderInfo ? orderInfo.amount : 0) +
              (userInfo ? userInfo.points : 0)}
            /{userInfo?.level.requirement}
          </span>
        </div>
        Upgrate after hitting {userInfo?.level.requirement} points.
        <p>Points will add to your account after payment confirmed.</p>
      </div>
    </div>
  );

  const messageDisplay = messageList.map((message) => {
    return (
      <div
        className={`chat ${message.isUserReceive ? "chat-start" : "chat-end"}`}
        key={message.id}
      >
        <div
          className={`chat-bubble ${
            message.isUserReceive ? "chat-bubble-success" : "chat-bubble-accent"
          }`}
        >
          {message.detail}
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="m-5 border border-primary w-5/6 h-5/6 bg-base-300 self-center">
        <table className="table border border-secondary">
          <thead>
            <tr className="border border-secondary">
              <th>Product</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{productDisplay}</tbody>
        </table>
        {orderInfoDislay}

        {orderInfo?.status === "Pending" && clientSecret && (
          <div className="m-3">
            <span className="text-xl">Online Payment:</span>
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "flat" } }}
            >
              <Payment />
            </Elements>
          </div>
        )}
        {orderInfo?.status === "Pending" && membershipDisplay}
        {<div className="divider">Message:</div>}
        <div
          className={`py-1 mx-3 my-2 bg-base-200 border-info ${
            !!messageList.length && "border"
          }`}
        >
          {!!messageList.length && messageDisplay}
          <div className="w-full flex flex-row items-center">
            <input
              className="m-1 input input-md w-full"
              type="input"
              placeholder="Type in message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="m-1 btn btn-md btn-primary btn-square"
              onClick={handleSendMessage}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
