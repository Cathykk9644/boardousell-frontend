import StarsIcon from "@mui/icons-material/Stars";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider, Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { item } from "../../type";

type props = {
  open: boolean;
  setDrawer: Function;
  wishlist: item[];
  handleDeleteItem: Function;
  handleWishToCart: Function;
  startAnime: boolean;
  setAnime: Function;
};

export default function Wishlist({
  open,
  setDrawer,
  wishlist,
  handleDeleteItem,
  handleWishToCart,
  startAnime,
  setAnime,
}: props): JSX.Element {
  const navi = useNavigate();

  const handleGoProduct = async (productId: number) => {
    setDrawer(null);
    navi(`product/${productId}`);
  };

  const wishlistDisplay = wishlist.map((item: item, i: number) => {
    return (
      <tr
        className={
          i % 2 === 0
            ? "bg-primary text-base-300"
            : "bg-secondary text-secondary-content"
        }
        key={item.id}
      >
        <td>
          <button
            className="m-1 btn btn-sm btn-square"
            onClick={() => handleDeleteItem(item.id, "wishlist")}
          >
            <DeleteIcon />
          </button>
        </td>
        <td>
          <button
            className="btn btn-ghost flex flex-col items-start"
            onClick={() => handleGoProduct(item.product.id)}
          >
            {item.product.name}
            <p className="text-xs">stock: {item.product.stock}</p>
          </button>
        </td>
        <td>
          $
          {item.product.onsale
            ? Math.round(item.product.price * item.product.onsale.discount)
            : item.product.price}
        </td>
        <td>
          <button
            className="m-1 btn btn-sm btn-square self-center"
            disabled={!item.product.stock}
            onClick={() => handleWishToCart(item.id, item.product.id)}
          >
            <AddShoppingCartIcon />
          </button>
        </td>
      </tr>
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
              <ArrowBackIcon />
            </button>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-5/6 h-5/6 self-center my-auto overflow-y-scroll">
            <table className="w-full">
              <tbody>{wishlistDisplay}</tbody>
            </table>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
