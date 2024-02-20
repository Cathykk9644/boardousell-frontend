import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import StarsIcon from "@mui/icons-material/Stars";
import { useAuth0 } from "@auth0/auth0-react";
import { product, item, outletProps, user } from "../type";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type checkoutList = product & {
  amounts: number;
};

type checkoutListObject = {
  [key: number]: checkoutList;
};

export default function CheckoutPage(): JSX.Element {
  const { userId, handleAddItem, handleDeleteItem, setError, setCart } =
    useOutletContext<outletProps>();
  const [newCart, setNewCart] = useState<item[]>([]);
  const [userInfo, setUserInfo] = useState<user | null>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
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
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.get(
          `${BACKENDURL}/customer/cart/info/${userId}`,
          config
        );
        const userDataRes = await axios.get(
          `${BACKENDURL}/customer/user/${userId}`,
          config
        );
        setUserInfo(userDataRes.data);
        setNewCart(data);
        setIsLoadingCart(false);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot load your cart.",
        });
      }
    };
    if (userId) {
      fetchData();
    }
  }, [
    getAccessTokenSilently,
    userId,
    setError,
    isAuthenticated,
    loginWithRedirect,
    isLoading,
  ]);

  const findCartId = (productId: number): number => {
    const index = newCart.findIndex((item) => item.product.id === productId);
    return newCart[index].id;
  };

  const handleCartToWish = (productId: number) => {
    try {
      handleReduceAmount(productId);
      handleAddItem(productId, "wishlist");
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Somethings went wrong. Cannot put cart back to wishlist.",
      });
    }
  };

  const handleReduceAmount = (productId: number) => {
    try {
      const cartId = findCartId(productId);
      handleDeleteItem(cartId, "cart");
      setNewCart((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Somethings went wrong. Cannot reduce amount.",
      });
    }
  };

  const checkoutListObject: checkoutListObject = {};
  for (const item of newCart) {
    if (checkoutListObject[item.product.id]) {
      checkoutListObject[item.product.id].amounts += 1;
    } else {
      checkoutListObject[item.product.id] = { ...item.product, amounts: 1 };
    }
  }

  let isAblePurchase = true;
  let tip: string | null = null;
  const productDisplay = Object.values(checkoutListObject).map((item) => {
    if (item.amounts > item.stock) {
      isAblePurchase = false;
      tip = "Sorry, we don't have enough stock yet.";
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

            <div className="tooltip" data-tip="Reduce one">
              <button
                className="btn btn-sm btn-square btn-outline"
                onClick={() => handleReduceAmount(item.id)}
              >
                <RemoveIcon />
              </button>
            </div>
          </div>
        </td>
        <td>{item.stock}</td>
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
  newCart.forEach((item) => {
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

  if (!newCart.length) {
    isAblePurchase = false;
    tip = "You do not have anythings in the cart";
  }
  if (!phone.length && !userInfo?.phone) {
    isAblePurchase = false;
    tip = "Please Add Phone Number Before checkout";
  }

  const handleConfirm = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (!userInfo?.phone) {
        await axios.put(
          `${BACKENDURL}/customer/user/${userId}`,
          { phone: phone },
          config
        );
      }
      const productIdList = newCart.map((item) => item.product.id);
      const { data } = await axios.post(
        `${BACKENDURL}/customer/order`,
        {
          userId,
          address,
          productIdList,
          amount: discountedAmount,
        },
        config
      );
      setCart([]);
      navi(`/order/${data}`);
    } catch (error) {
      setError({
        backHome: true,
        message: "Oh. Somethings went wrong. Cannot confirm your order.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl my-5">Checkout</h1>
      <table className="mx-auto w-5/6 table table-sm border-2 border-accent bg-base-300">
        <thead>
          <tr className="border border-accent">
            <th>Action</th>
            <th>stock</th>
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
          {userInfo && userInfo.level.discount < 1 && (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Discount:</td>
              <td>{userInfo.level.discount * 100}%</td>
            </tr>
          )}
          {userInfo && userInfo.level.discount < 1 && (
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

        {!userInfo?.phone && (
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
