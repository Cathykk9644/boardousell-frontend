import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Wishlist from "./Component/Sub-Component/Wishlist";
import ShoppingCart from "./Component/Sub-Component/ShoppingCart";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type outletProps = {
  handleAddWishItem: Function;
};
type wishItem = {
  id: number;
  product: {
    name: string;
    stocks: number;
  };
};
type wishlist = wishItem[];
type drawer = "nav" | "wish" | "cart" | null;

export default function App() {
  const [userId, setUserId] = useState<number>(2);
  const [wishlist, setWishlist] = useState<wishlist>([]);
  const [drawer, setDrawer] = useState<drawer>(null);

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

  const handleAddWishItem = async (productId: number) => {
    try {
      const { data } = await axios.post(`${BACKENDURL}/wishlist`, {
        userId: userId,
        productId: productId,
      });
      setWishlist((prev) => [...prev, data]);
      setDrawer("wish");
    } catch (error) {
      console.log(error);
    }
  };

  const outletProps: outletProps = {
    handleAddWishItem: handleAddWishItem,
  };
  return (
    <div data-theme="nord">
      <Navibar open={drawer === "nav"} setDrawer={setDrawer} />
      <Outlet context={outletProps} />
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <nav>
          <Link className="link link-hover" to="/aboutus">
            About us
          </Link>

          <Link className="link link-hover" to="/policy">
            Policy
          </Link>
        </nav>
        <Wishlist
          open={drawer === "wish"}
          setDrawer={setDrawer}
          wishlist={wishlist}
          setWishlist={setWishlist}
        />
        <ShoppingCart open={drawer === "cart"} setDrawer={setDrawer} />
      </footer>
    </div>
  );
}
