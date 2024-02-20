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
import { useAuth0 } from "@auth0/auth0-react";
import { order, user, product, message, outletProps } from "../type";
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY ? process.env.REACT_APP_STRIPE_KEY : ""
);

export default function OrderPage(): JSX.Element {
  const { orderId } = useParams<Params>();
  const [orderInfo, setOrderInfo] = useState<order>();
  const [userInfo, setUserInfo] = useState<user>();
  const [productList, setProductList] = useState<product[]>([]);
  const [messageList, setMessageList] = useState<message[]>([]);
  const [input, setInput] = useState<string>("");
  const [clientSecret, setClientSecret] = useState("");
  const navi = useNavigate();
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  const { userId, setError } = useOutletContext<outletProps>();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      loginWithRedirect();
    }
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.get(
          `${BACKENDURL}/customer/order/${orderId}`,
          config
        );
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
        const res = await axios.post(
          `${BACKENDURL}/customer/payment`,
          {
            amount: order.amount,
          },
          config
        );
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot load this order.",
        });
      }
    };
    if (userId) {
      fetchData();
    }
  }, [
    getAccessTokenSilently,
    navi,
    orderId,
    userId,
    setError,
    isAuthenticated,
    loginWithRedirect,
    isLoading,
  ]);

  const handleSendMessage = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.post(
        `${BACKENDURL}/customer/message`,
        {
          orderId: Number(orderId),
          detail: input,
        },
        config
      );
      setMessageList((prev) => [...prev, data]);
      setInput("");
    } catch (error) {
      setError({
        backHome: false,
        message: "Oh. Somethings went wrong. Cannot send message.",
      });
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

  const createdTimestamp = orderInfo ? Date.parse(orderInfo.createdAt) : 0;
  const createdDate = new Date(createdTimestamp);
  const updatedTimestamp = orderInfo ? Date.parse(orderInfo.updatedAt) : 0;
  const updatedDate = new Date(updatedTimestamp);
  const orderInfoDislay = (
    <table className="table m-2">
      <tbody>
        <tr>
          <th>Order No.</th>
          <td>{orderId}</td>
        </tr>
        <tr>
          <th>Ordering Date:</th>
          <td>{createdDate.toLocaleString()}</td>
        </tr>
        <tr>
          <th>Last Update:</th>
          <td>{updatedDate.toLocaleString()}</td>
        </tr>
        <tr>
          <th>Status:</th>
          <td>{orderInfo?.status}</td>
        </tr>
        <tr>
          <th>Shipping Address: </th>
          <td>{orderInfo?.address}</td>
        </tr>
        <tr>
          <th>Amount:</th>
          <td>${orderInfo?.amount}</td>
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
        className={`chat ${message.isUserReceiver ? "chat-start" : "chat-end"}`}
        key={message.id}
      >
        <div
          className={`chat-bubble ${
            message.isUserReceiver
              ? "chat-bubble-success"
              : "chat-bubble-accent"
          }`}
        >
          {message.detail}
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Link to="/orderList" className="mt-5 btn btn-outline w-5/6 self-center">
        Back to order List
      </Link>
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
              <Payment setError={setError} setOrderInfo={setOrderInfo} />
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
