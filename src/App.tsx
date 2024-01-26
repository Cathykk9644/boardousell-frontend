import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Wishlist from "./Component/Sub-Component/Wishlist";
import ShoppingCart from "./Component/Sub-Component/ShoppingCart";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type wishItem = {
  id: number;
  product: {
    name: string;
    stocks: number;
  };
};
type wishlist = wishItem[];

export default function App() {
  const [userId, setUserId] = useState<number>(1);
  const [wishlist, setWishlist] = useState<wishlist>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(`${BACKENDURL}/wishlist/${userId}`);
        setWishlist(wishlistRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div data-theme="nord">
      <Navibar />
      <Outlet context={userId} />
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <nav>
          <Link className="link link-hover" to="/aboutus">
            About us
          </Link>

          <Link className="link link-hover" to="/policy">
            Policy
          </Link>
        </nav>
        <Wishlist wishlist={wishlist} setWishlist={setWishlist} />
        <ShoppingCart />
      </footer>
    </div>
  );
}
