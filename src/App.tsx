import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Wishlist from "./Component/Sub-Component/Wishlist";
import ShoppingCart from "./Component/Sub-Component/ShoppingCart";
import ErrorPage from "./Component/Sub-Component/ErrorPage";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type item = {
  id: number;
  product: {
    id: number;
    price: number;
    name: string;
    stocks: number;
  };
};
type anime = "wish" | "cart" | null;
type drawer = "nav" | anime;

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
  setError: Function;
};
export default function App() {
  const [userId, setUserId] = useState<number>(3);
  const [wishlist, setWishlist] = useState<item[]>([]);
  const [cart, setCart] = useState<item[]>([]);
  const [drawer, setDrawer] = useState<drawer>(null);
  const [anime, setAnime] = useState<anime>(null);
  const location = useLocation();
  const navi = useNavigate();
  const [error, setError] = useState<{
    backHome: boolean;
    message: string;
  } | null>({ backHome: true, message: "TEsting for some error" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(
          `${BACKENDURL}/wishlist/info/${userId}`
        );
        setWishlist(wishlistRes.data);
        const cartRes = await axios.get(`${BACKENDURL}/cart/info/${userId}`);
        setCart(cartRes.data);
      } catch (err) {
        setError({
          backHome: false,
          message: "Oh. Sorry, somethings went wrong for now.",
        });
      }
    };

    fetchData();
  }, [userId, location.pathname]);

  const handleAddWishItem = async (productId: number) => {
    try {
      const { data } = await axios.post(`${BACKENDURL}/wishlist`, {
        userId: userId,
        productId: productId,
      });
      setWishlist((prev) => [...prev, data]);
      setAnime("wish");
    } catch (err) {
      setError({
        backHome: true,
        message: "Oh. Sorry, cannot add wish item for now.",
      });
    }
  };

  const handleDeleteWish = async (wishlistId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/wishlist/${wishlistId}`);
      setWishlist((prev: item[]) =>
        prev.filter((item: item) => item.id !== wishlistId)
      );
    } catch (err) {
      setError({
        backHome: false,
        message: "Oh. Sorry, cannot delete this wish item for now.",
      });
    }
  };

  const handleAddCart = async (productId: number) => {
    try {
      const { data } = await axios.post(`${BACKENDURL}/cart`, {
        userId: userId,
        productId: productId,
      });
      setCart((prev: item[]) => [...prev, data]);
      setAnime("cart");
    } catch (err) {
      setError({
        backHome: true,
        message: "Oh. Sorry, cannot add this into your cart for now.",
      });
    }
  };

  const handleDeleteCart = async (cartId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/cart/${cartId}`);
      setCart((prev: item[]) =>
        prev.filter((item: item) => item.id !== cartId)
      );
    } catch (error) {
      setError({
        backHome: false,
        message: "Oh. Sorry, cannot delete this from your cart for now.",
      });
    }
  };

  const handleWishToCart = (wishlistId: number, productId: number) => {
    handleAddCart(productId);
    handleDeleteWish(wishlistId);
    setDrawer("cart");
  };

  const handleError = () => {
    if (error?.backHome) {
      navi("/");
    }
    setError(null);
  };

  const outletProps: outletProps = {
    userId,
    handleAddWishItem,
    handleAddCart,
    handleDeleteCart,
    setError,
  };
  return (
    <div data-theme="nord" className="min-h-screen">
      <Navibar
        open={drawer === "nav"}
        setDrawer={setDrawer}
        setError={setError}
      />
      <Outlet context={outletProps} />
      <Wishlist
        open={drawer === "wish"}
        setDrawer={setDrawer}
        wishlist={wishlist}
        handleDeleteWish={handleDeleteWish}
        handleWishToCart={handleWishToCart}
        startAnime={anime === "wish"}
        setAnime={setAnime}
      />
      <ShoppingCart
        open={drawer === "cart"}
        setDrawer={setDrawer}
        cart={cart}
        handleDeleteCart={handleDeleteCart}
        startAnime={anime === "cart"}
        setAnime={setAnime}
      />
      <footer className="footer p-5 pl-10 bg-neutral text-neutral-content h-min">
        <nav>
          <Link className="link link-hover" to="/aboutus">
            About us
          </Link>

          <Link className="link link-hover" to="/policy">
            Policy
          </Link>
        </nav>
      </footer>
      <ErrorPage error={error} handleError={handleError} />
    </div>
  );
}
