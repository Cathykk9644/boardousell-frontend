import StarsIcon from "@mui/icons-material/Stars";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Drawer } from "@mui/material";
import axios from "axios";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type wishItem = {
  id: number;
  product: {
    name: string;
    stocks: number;
  };
};
type wishlist = wishItem[];
type props = {
  open: boolean;
  setDrawer: Function;
  wishlist: wishlist;
  setWishlist: Function;
};

//Need to add add shopping cart
export default function Wishlist({
  open,
  setDrawer,
  wishlist,
  setWishlist,
}: props) {
  const handleDelete = async (wishlistId: number) => {
    try {
      await axios.delete(`${BACKENDURL}/wishlist/${wishlistId}`);
      setWishlist((prev: wishlist) =>
        prev.filter((item: wishItem) => item.id !== wishlistId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const wishlistDisplay = wishlist.map((item, i) => {
    return (
      <li
        className={`flex items-center ${
          i % 2 === 0 ? "bg-primary" : "bg-secondary"
        }`}
        key={item.id}
      >
        <button className="m-1 btn btn-sm btn-square">
          <AddShoppingCartIcon />
        </button>
        <button
          className="m-1 btn btn-sm btn-square"
          onClick={() => handleDelete(item.id)}
        >
          <DeleteIcon />
        </button>
        <span>{item.product.name}</span>
      </li>
    );
  });

  return (
    <div>
      <div className="fixed bottom-20 right-5">
        <div className="indicator">
          <div className="tooltip" data-tip="Wishlist">
            <span className="indicator-item badge badge-primary">
              {wishlist.length}
            </span>
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
        <div className="flex flex-col bg-neutral-content min-h-screen w-72">
          <div className="h-20 flex justify-evenly items-center">
            <h1 className="text-3xl">Wishlist</h1>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-4/5 h-5/6 self-center my-auto ">
            <ul>{wishlistDisplay}</ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
