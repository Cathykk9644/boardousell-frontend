import StarsIcon from "@mui/icons-material/Stars";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Divider, Drawer } from "@mui/material";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { useNavigate } from "react-router-dom";

type item = {
  id: number;
  product: {
    id: number;
    price: number;
    name: string;
    stocks: number;
  };
};
type props = {
  open: boolean;
  setDrawer: Function;
  wishlist: item[];
  setWishlist: Function;
};

//Need to add add shopping cart
export default function Wishlist({
  open,
  setDrawer,
  wishlist,
  setWishlist,
}: props) {
  const navi = useNavigate();
  const handleDelete = async (wishlistId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/wishlist/${wishlistId}`);
      setWishlist((prev: item[]) =>
        prev.filter((item: item) => item.id !== wishlistId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoProduct = async (productId: number) => {
    setDrawer(null);
    navi(`product/${productId}`);
  };

  const wishlistDisplay = wishlist.map((item: item, i: number) => {
    return (
      <li
        className={`flex justify-between items-center  ${
          i % 2 === 0 ? "bg-primary" : "bg-secondary"
        }`}
        key={item.id}
      >
        {" "}
        <button
          className="m-1 btn btn-sm btn-square"
          onClick={() => handleDelete(item.id)}
        >
          <DeleteIcon />
        </button>
        <button
          className="btn btn-ghost max-w-32"
          onClick={() => handleGoProduct(item.product.id)}
        >
          {item.product.name}
        </button>
        <div className="flex min-w-32 justify-between">
          <div>
            ${item.product.price}
            <p>Stocks: {item.product.stocks}</p>
          </div>
          <button
            className="m-1 btn btn-sm btn-square self-center"
            disabled={!item.product.stocks}
          >
            <AddShoppingCartIcon />
          </button>
        </div>
      </li>
    );
  });

  return (
    <div>
      <div className="fixed bottom-20 right-5">
        <div className="indicator">
          <div className="tooltip" data-tip="Wishlist">
            {!!wishlist.length && (
              <span className="indicator-item badge badge-primary">
                {wishlist.length}
              </span>
            )}
            <button
              className="btn btn-accent border-neutral ring-1 rounded-3xl"
              onClick={() => setDrawer("wish")}
            >
              <StarsIcon />
            </button>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={() => setDrawer(null)}>
        <div className="flex flex-col bg-neutral-content min-h-screen w-96 max-w-full-screen">
          <div className="h-20 flex justify-evenly items-center">
            <h1 className="text-3xl">Wishlist</h1>
            <button className="absolute left-5" onClick={() => setDrawer(null)}>
              <ArrowForwardIcon />
            </button>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-4/5 h-5/6 self-center my-auto">
            <ul className="w-full">{wishlistDisplay}</ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
