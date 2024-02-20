import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Wishlist from "./Component/Sub-Component/Wishlist";
import ShoppingCart from "./Component/Sub-Component/ShoppingCart";
import ErrorPage from "./Component/Sub-Component/ErrorPage";
import { useAuth0 } from "@auth0/auth0-react";
import AdminPage from "./Component/Admin-Sub/AdminPage";
import { item, outletProps, user } from "./type";
import { BACKENDURL } from "./constant";
type anime = "wish" | "cart" | null;
type drawer = "nav" | anime;

export default function App(): JSX.Element {
  const [userId, setUserId] = useState<number>(0);
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<item[]>([]);
  const [cart, setCart] = useState<item[]>([]);
  const [drawer, setDrawer] = useState<drawer>(null);
  const [anime, setAnime] = useState<anime>(null);
  const navi = useNavigate();
  const [error, setError] = useState<{
    backHome: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data }: { data: [user, boolean] } = await axios.get(
          `${BACKENDURL}/customer/user/login/${user?.sub}`,
          config
        );
        //data[0] is the user Data
        //data[1] trues means the user data is new made.
        if (data[1]) {
          await axios.put(
            `${BACKENDURL}/customer/user/${data[0].id}`,
            {
              email: user?.email,
              name: user?.nickname,
              phone: user?.phone_number,
            },
            config
          );
        }
        setUserId(data[0].id);
        setIsAdmin(data[0].isAdmin);
        const wishlistRes = await axios.get(
          `${BACKENDURL}/customer/wishlist/info/${data[0].id}`,
          config
        );
        setWishlist(wishlistRes.data);
        const cartRes = await axios.get(
          `${BACKENDURL}/customer/cart/info/${data[0].id}`,
          config
        );
        setCart(cartRes.data);
      } catch (err: any) {
        setError({
          backHome: false,
          message: "Oh. Somethings went wrong. Cannot get user data.",
        });
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchAuthData();
    }
    if (!isLoading && !isAuthenticated) {
      setIsAdmin(false);
      setUserId(0);
    }
  }, [
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    user?.email,
    user?.nickname,
    user?.phone_number,
    user?.sub,
  ]);

  const handleAddItem = async (
    productId: number,
    target: "cart" | "wishlist"
  ) => {
    if (!isAuthenticated) {
      return loginWithRedirect();
    }
    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.post(
        `${BACKENDURL}/customer/${target}`,
        {
          userId: userId,
          productId: productId,
        },
        config
      );
      if (target === "wishlist") {
        setWishlist((prev) => [...prev, data]);
        setAnime("wish");
      } else {
        setCart((prev: item[]) => [...prev, data]);
        setAnime("cart");
      }
    } catch (err) {
      setError({
        backHome: true,
        message: `Oh. Somethings went wrong. Cannot add ${target} for now.`,
      });
    }
  };

  const handleDeleteItem = async (id: number, target: "cart" | "wishlist") => {
    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${BACKENDURL}/customer/${target}/${id}`, config);
      const updateState = (prev: item[]) => {
        return prev.filter((item: item) => item.id !== id);
      };
      if (target === "cart") {
        setCart((prev: item[]) => updateState(prev));
      } else {
        setWishlist((prev: item[]) => updateState(prev));
      }
    } catch (err) {
      setError({
        backHome: false,
        message: `Oh. Somethings went wrong. Cannot delete ${target}.`,
      });
    }
  };

  const handleWishToCart = (wishlistId: number, productId: number) => {
    handleAddItem(productId, "cart");
    handleDeleteItem(wishlistId, "wishlist");
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
    handleAddItem,
    handleDeleteItem,
    setError,
    setCart,
  };

  return isAdmin ? (
    <AdminPage />
  ) : (
    <div data-theme="nord" className="min-h-screen">
      <ErrorPage error={error} handleError={handleError} />
      <Navibar
        open={drawer === "nav"}
        setDrawer={setDrawer}
        setError={setError}
      />
      <Outlet context={outletProps} />
      {isAuthenticated && (
        <Wishlist
          open={drawer === "wish"}
          setDrawer={setDrawer}
          wishlist={wishlist}
          handleDeleteItem={handleDeleteItem}
          handleWishToCart={handleWishToCart}
          startAnime={anime === "wish"}
          setAnime={setAnime}
        />
      )}
      {isAuthenticated && (
        <ShoppingCart
          open={drawer === "cart"}
          setDrawer={setDrawer}
          cart={cart}
          handleDeleteItem={handleDeleteItem}
          startAnime={anime === "cart"}
          setAnime={setAnime}
        />
      )}
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
