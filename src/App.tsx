import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Wishlist from "./Component/Sub-Component/Wishlist";
import ShoppingCart from "./Component/Sub-Component/ShoppingCart";
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
};
export default function App() {
  const [userId, setUserId] = useState<number>(3);
  const [wishlist, setWishlist] = useState<item[]>([]);
  const [cart, setCart] = useState<item[]>([]);
  const [drawer, setDrawer] = useState<drawer>(null);
  const [anime, setAnime] = useState<anime>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(
          `${BACKENDURL}/wishlist/info/${userId}`
        );
        setWishlist(wishlistRes.data);
        const cartRes = await axios.get(`${BACKENDURL}/cart/info/${userId}`);
        setCart(cartRes.data);
      } catch (error) {
        console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteWish = async (wishlistId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/wishlist/${wishlistId}`);
      setWishlist((prev: item[]) =>
        prev.filter((item: item) => item.id !== wishlistId)
      );
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCart = async (cartId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/cart/${cartId}`);
      setCart((prev: item[]) =>
        prev.filter((item: item) => item.id !== cartId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleWishToCart = async (wishlistId: number, productId: number) => {
    try {
      handleAddCart(productId);
      handleDeleteWish(wishlistId);
      setDrawer("cart");
    } catch (error) {
      console.log(error);
    }
  };

  const outletProps: outletProps = {
    userId,
    handleAddWishItem,
    handleAddCart,
    handleDeleteCart,
  };
  return (
    <div data-theme="nord" className="min-h-screen">
      <Navibar open={drawer === "nav"} setDrawer={setDrawer} />
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
    </div>
  );
}
