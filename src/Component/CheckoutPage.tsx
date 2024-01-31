import axios from "axios";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import StarsIcon from "@mui/icons-material/Stars";
import { isFunctionDeclaration } from "typescript";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type checkoutList = {
  id: number;
  price: number;
  name: string;
  stocks: number;
  amounts: number;
};

type checkoutListObject = {
  [key: number]: checkoutList;
};

type item = {
  id: number;
  product: {
    id: number;
    price: number;
    name: string;
    stocks: number;
  };
};

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
};
type userInfo = {
  email: string;
  points: number;
  level: {
    title: string;
    discount: number;
  };
} | null;

export default function CheckoutPage() {
  const { userId, handleAddWishItem, handleDeleteCart } =
    useOutletContext<outletProps>();
  const [cart, setCart] = useState<item[]>([]);
  const [userInfo, setUserInfo] = useState<userInfo>(null);
  const [address, setAddress] = useState<string>("");
  const navi = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/user/${userId}`);
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCartData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/cart/${userId}`);
        setCart(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
    fetchCartData();
  }, [userId]);

  const findCartId = (productId: number): number => {
    const index = cart.findIndex((item) => item.product.id === productId);
    return cart[index].id;
  };

  const handleCartToWish = (productId: number) => {
    try {
      handleReduceAmount(productId);
      handleAddWishItem(productId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReduceAmount = (productId: number) => {
    try {
      const cartId = findCartId(productId);
      handleDeleteCart(cartId);
      setCart((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      console.log(error);
    }
  };

  const checkoutListObject: checkoutListObject = {};
  for (const item of cart) {
    if (checkoutListObject[item.product.id]) {
      checkoutListObject[item.product.id].amounts += 1;
    } else {
      checkoutListObject[item.product.id] = { ...item.product, amounts: 1 };
    }
  }

  const handleConfirm = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  let isAblePurchase = true;
  const productDisplay = Object.values(checkoutListObject).map((item) => {
    if (item.amounts > item.stocks) {
      isAblePurchase = false;
    }
    return (
      <tr key={item.id}>
        <th>
          <Link to={`/product/${item.id}`} className="max-w-min">
            {item.name}
          </Link>
        </th>
        <th>{item.price}</th>
        <th>{item.amounts}</th>
        <th>{item.stocks}</th>
        <th className="space-x-1">
          <button
            className="btn btn-sm btn-square btn-outline"
            onClick={() => handleCartToWish(item.id)}
          >
            <StarsIcon />
          </button>
          <button
            className="btn btn-sm btn-square btn-outline"
            onClick={() => handleReduceAmount(item.id)}
          >
            <RemoveIcon />
          </button>
        </th>
      </tr>
    );
  });

  let totalAmount = 0;
  cart.forEach((item) => (totalAmount += item.product.price));
  const discountedAmount = userInfo ? totalAmount * userInfo.level.discount : 0;
  if (!cart.length) {
    isAblePurchase = false;
  }
  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl my-5">Checkout</h1>
      <table className="mx-auto w-5/6 table table-sm border border-accent ">
        <thead>
          <tr className="border border-accent">
            <th>Product</th>
            <th>Price</th>
            <th>Nos</th>
            <th>Stocks</th>
            <th>Action</th>
          </tr>
          {productDisplay}
        </thead>
      </table>
      <div className="flex flex-col w-5/6 m-5 space-y-1">
        <label>Shipping Address:</label>
        <input
          type="input"
          placeholder="Left it blank if you pick up at store."
          className="input input-bordered input-primary"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div
        className="tooltip w-5/6"
        data-tip={
          isAblePurchase ? null : "Sorry, we do not have enough stocks."
        }
      >
        <button
          className={`btn ${
            isAblePurchase ? "btn-accent" : "btn-warning"
          } w-full`}
          disabled={!isAblePurchase}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
      <p className="w-5/6">
        Please note that you need to pay online/at store in order to confirm
        your order. (This is only a website for display, please feel free to try
        the feature.)
      </p>
    </div>
  );
}
