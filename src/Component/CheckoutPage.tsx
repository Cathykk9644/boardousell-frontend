import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import StarsIcon from "@mui/icons-material/Stars";
import { useAuth0 } from "@auth0/auth0-react";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type checkoutList = {
  id: number;
  price: number;
  name: string;
  stocks: number;
  amounts: number;
  onsale?: {
    discount: number;
  };
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
    onsale?: {
      discount: number;
    };
  };
};

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
  setError: Function;
};
type userInfo = {
  email: string;
  points: number;
  phone: number;
  level: {
    discount: number;
  };
} | null;

export default function CheckoutPage() {
  const { userId, handleAddWishItem, handleDeleteCart, setError } =
    useOutletContext<outletProps>();
  const [cart, setCart] = useState<item[]>([]);
  const [userInfo, setUserInfo] = useState<userInfo>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navi = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      loginWithRedirect();
    }
    const fetchData = async () => {
      try {
        setIsLoadingCart(true);
        const { data } = await axios.get(`${BACKENDURL}/cart/info/${userId}`);
        const userDataRes = await axios.get(`${BACKENDURL}/user/${userId}`);
        setUserInfo(userDataRes.data);
        setCart(data);
        setIsLoadingCart(false);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Sorry, cannot load your cart for now.",
        });
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId, setError, isAuthenticated, loginWithRedirect, isLoading]);

  const findCartId = (productId: number): number => {
    const index = cart.findIndex((item) => item.product.id === productId);
    return cart[index].id;
  };

  const handleCartToWish = (productId: number) => {
    try {
      handleReduceAmount(productId);
      handleAddWishItem(productId);
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Sorry, somethings went wrong.",
      });
    }
  };

  const handleReduceAmount = (productId: number) => {
    try {
      const cartId = findCartId(productId);
      handleDeleteCart(cartId);
      setCart((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Sorry, somethings went wrong.",
      });
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

  let isAblePurchase = true;
  let tip: string | null = null;
  const productDisplay = Object.values(checkoutListObject).map((item) => {
    if (item.amounts > item.stocks) {
      isAblePurchase = false;
      tip = "Sorry, we don't have enough stocks yet.";
    }
    return (
      <tr key={item.id}>
        <td>
          <div className="flex flex-row">
            <div className="tooltip" data-tip="Add back to wishlist">
              <button
                className="mr-1 btn btn-sm btn-square btn-outline"
                onClick={() => handleCartToWish(item.id)}
              >
                <StarsIcon />
              </button>
            </div>

            <div className="tooltip" data-tip="Reduce one ">
              <button
                className="btn btn-sm btn-square btn-outline"
                onClick={() => handleReduceAmount(item.id)}
              >
                <RemoveIcon />
              </button>
            </div>
          </div>
        </td>
        <td>{item.stocks}</td>
        <td>
          <Link to={`/product/${item.id}`} className="max-w-min">
            {item.name}
          </Link>
        </td>
        <td>{item.amounts}</td>
        <td>
          {item.onsale ? (
            <div>
              <div className="line-through">${item.price}</div>
              <div>${Math.round(item.price * item.onsale.discount)}</div>
            </div>
          ) : (
            <div>${item.price}</div>
          )}
        </td>
      </tr>
    );
  });

  let totalAmount = 0;
  cart.forEach((item) => {
    if (item.product.onsale) {
      totalAmount += Math.round(
        item.product.price * item.product.onsale.discount
      );
    } else {
      totalAmount += item.product.price;
    }
  });

  const discountedAmount = userInfo
    ? Math.round(totalAmount * userInfo.level.discount)
    : 0;

  const handleConfirm = async () => {
    try {
      if (userInfo && !userInfo.phone) {
        await axios.put(`${BACKENDURL}/user/${userId}`, { phone: phone });
      }
      const productIdList = cart.map((item) => item.product.id);
      const { data } = await axios.post(`${BACKENDURL}/order`, {
        userId,
        address,
        productIdList,
        amount: discountedAmount,
      });
      navi(`/order/${data}`);
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Sorry, somethings went wrong.",
      });
    }
  };

  if (!cart.length) {
    isAblePurchase = false;
    tip = "You do not have anythings in the cart";
  }
  if (!phone.length && userInfo && !userInfo.phone) {
    isAblePurchase = false;
    tip = "Please Add Phone Number Before checkout";
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl my-5">Checkout</h1>
      <table className="mx-auto w-5/6 table table-sm border-2 border-accent bg-base-300">
        <thead>
          <tr className="border border-accent">
            <th>Action</th>
            <th>Stocks</th>
            <th>Product</th>
            <th>Nos</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {productDisplay}
          <tr>
            <td className="border-t-2 border-accent"></td>
            <td className="border-t-2 border-accent"></td>
            <td className="border-t-2 border-accent"></td>
            <td className="border-t-2 border-accent">Total:</td>
            <td className="border-t-2 border-accent">${totalAmount}</td>
          </tr>
          {userInfo && userInfo?.level.discount < 1 && (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Discount:</td>
              <td>{userInfo.level.discount * 100}%</td>
            </tr>
          )}
          {userInfo && userInfo?.level.discount < 1 && (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>After Discount:</td>
              <td>${discountedAmount}</td>
            </tr>
          )}
        </tbody>
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

        {userInfo && !userInfo.phone && (
          <div className="flex justify-between items-center">
            <label>Phone: </label>
            <input
              type="input"
              placeholder="Please input your phone before checkout."
              className="input input-bordered input-primary w-full ml-5"
              value={phone}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  setPhone(e.target.value);
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="tooltip w-5/6" data-tip={tip}>
        <button
          className={`btn ${
            isAblePurchase ? "btn-accent" : "btn-warning"
          } w-full`}
          disabled={!isAblePurchase || isLoadingCart}
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
