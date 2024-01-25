import StarsIcon from "@mui/icons-material/Stars";
import { Drawer } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;
type props = {
  userEmail: string;
};
type wishItem = {
  product: {
    name: string;
    stocks: number;
  };
};
type wishlist = wishItem[];

export default function Wishlist(props: props) {
  const [wishlist, setWishlist] = useState<wishlist>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(
          `${BACKENDURL}/wishlist/${props.userEmail}`
        );
        setWishlist(wishlistRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [props.userEmail]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <div className="bg-neutral-content min-h-screen w-52 flex flex-col items-center">
          <h1>Wishlist</h1>
        </div>
      </Drawer>
      <div className="tooltip fixed bottom-32 right-12" data-tip="Wishlist">
        <button
          className="btn btn-accent border-neutral ring-1 rounded-3xl fixed bottom-20 right-5"
          onClick={() => setOpen(true)}
        >
          <StarsIcon />
        </button>
      </div>
    </div>
  );
}
