import StarsIcon from "@mui/icons-material/Stars";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider, Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";

type item = {
  id: number;
  product: {
    id: number;
    price: number;
    name: string;
    stock: number;
    onsale?: {
      discount: number;
    };
  };
};
type props = {
  open: boolean;
  setDrawer: Function;
  wishlist: item[];
  handleDeleteWish: Function;
  handleWishToCart: Function;
  startAnime: boolean;
  setAnime: Function;
};

export default function Wishlist({
  open,
  setDrawer,
  wishlist,
  handleDeleteWish,
  handleWishToCart,
  startAnime,
  setAnime,
}: props) {
  const navi = useNavigate();

  const handleGoProduct = async (productId: number) => {
    setDrawer(null);
    navi(`product/${productId}`);
  };

  const wishlistDisplay = wishlist.map((item: item, i: number) => {
    return (
      <li
        className={`flex justify-between items-center  ${
          i % 2 === 0
            ? "bg-primary text-base-300"
            : "bg-secondary text-secondary-content"
        }`}
        key={item.id}
      >
        {" "}
        <button
          className="m-1 btn btn-sm btn-square"
          onClick={() => handleDeleteWish(item.id)}
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
            $
            {item.product.onsale
              ? Math.round(item.product.price * item.product.onsale.discount)
              : item.product.price}
            <p>stock: {item.product.stock}</p>
          </div>
          <button
            className="m-1 btn btn-sm btn-square self-center"
            disabled={!item.product.stock}
            onClick={() => handleWishToCart(item.id, item.product.id)}
          >
            <AddShoppingCartIcon />
          </button>
        </div>
      </li>
    );
  });

  return (
    <div>
      <div
        className={`fixed bottom-20 right-5 z-10 ${
          startAnime && "add-item-animation"
        }`}
        onAnimationEnd={() => setAnime(null)}
      >
        <div className="indicator">
          <div className="tooltip" data-tip="Wishlist">
            {!!wishlist.length && (
              <span className="indicator-item badge badge-primary">
                {wishlist.length}
              </span>
            )}
            <button
              className="btn btn-secondary border-neutral ring-1 rounded-3xl"
              onClick={() => setDrawer("wish")}
            >
              <StarsIcon className="" />
            </button>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={() => setDrawer(null)}>
        <div className="flex flex-col bg-neutral-content min-h-screen w-96 max-w-full-screen">
          <div className="h-20 flex justify-evenly items-center">
            <h1 className="text-3xl">Wishlist</h1>
            <button className="absolute left-5" onClick={() => setDrawer(null)}>
              <ArrowBackIcon />
            </button>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-5/6 h-5/6 self-center my-auto overflow-y-scroll">
            <ul className="w-full ">{wishlistDisplay}</ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
