import axios from "axios";
import { useEffect, useState } from "react";
import {
  Params,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { BACKENDURL } from "../constant";

type order = {
  id: number;
  userId: number;
  address: string;
  amount: number;
  status: string;
  createAt: string;
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
  isUserReceive: boolean;
  detail: string;
  createAt: string;
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
  const navi = useNavigate();
  const { userId } = useOutletContext<outletProps>();
  console.log(orderInfo);
  console.log(userInfo);
  console.log(productList);
  console.log(messageList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/order/${orderId}`);
        if (data.userId !== userId) {
          return navi(`/`);
        }
        const { user, products, messages, ...order } = data;
        setOrderInfo(order);
        setUserInfo(user);
        setProductList(products);
        setMessageList(messages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [orderId]);

  return (
    <div className="min-h-screen">
      {/* <div className="w-5/6 flex flex-col">
        You are in {userInfo?.level.title} membership now.
        <div className="flex flex-col w-full">
          <div className="w-full flex items-center">
            <progress
              className="progress progress-primary"
              value={userInfo?.points}
              max={userInfo?.level.requirement}
            />
            <span className="pl-1">
              {userInfo?.points}/{userInfo?.level.requirement}
            </span>
          </div>
          <div className="w-full flex items-center">
            <progress
              className="progress progress-secondary
            "
              value={discountedAmount + (userInfo ? userInfo.points : 0)}
              max={userInfo?.level.requirement}
            />
            <span className="pl-1">
              {discountedAmount + (userInfo ? userInfo.points : 0)}/
              {userInfo?.level.requirement}
            </span>
          </div>
          Upgrate after hitting {userInfo?.level.requirement} points.
        </div>
      </div> */}
      {orderId}
    </div>
  );
}
