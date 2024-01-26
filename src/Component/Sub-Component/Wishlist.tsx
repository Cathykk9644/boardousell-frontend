import StarsIcon from "@mui/icons-material/Stars";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Drawer } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;
type props = {
  userId: number;
};
type wishItem = {
  id: number;
  product: {
    name: string;
    stocks: number;
  };
};
type wishlist = wishItem[];

//Need to add add shopping cart
//Need to develop handle close to update database
export default function Wishlist(props: props) {
  const [wishlist, setWishlist] = useState<wishlist>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(
          `${BACKENDURL}/wishlist/${props.userId}`
        );
        setWishlist(wishlistRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [props.userId]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (index: number) => {
    const newWishList = [...wishlist];
    newWishList.splice(index, 1);
    setWishlist(newWishList);
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
          onClick={() => handleDelete(i)}
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
              onClick={() => setOpen(true)}
            >
              <StarsIcon />
            </button>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <div className="flex flex-col bg-neutral-content min-h-screen w-72">
          <div className="h-20 flex justify-evenly items-center">
            <h1 className="text-3xl">Wishlist</h1>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-4/5 h-5/6 self-center my-auto overflow-x-scroll">
            <ul>{wishlistDisplay}</ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
