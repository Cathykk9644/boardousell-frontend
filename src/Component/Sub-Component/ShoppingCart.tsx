import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Drawer } from "@mui/material";
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
  cart: item[];
  handleDeleteCart: Function;
  startAnime: boolean;
  setAnime: Function;
};

export default function ShoppingCart({
  open,
  setDrawer,
  cart,
  handleDeleteCart,
  startAnime,
  setAnime,
}: props) {
  const navi = useNavigate();

  const handleGoProduct = async (productId: number) => {
    setDrawer(null);
    navi(`product/${productId}`);
  };
  const handleCheckout = async () => {
    setDrawer(null);
    navi(`checkout`);
  };
  const cartDisplay = cart.map((item: item, i: number) => {
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
          onClick={() => handleDeleteCart(item.id)}
        >
          <DeleteIcon />
        </button>
        <button
          className="btn btn-ghost max-w-32"
          onClick={() => handleGoProduct(item.product.id)}
        >
          {item.product.name}
        </button>
        <div className="flex flex-col flex-end min-w-24 justify-between">
          ${item.product.price}
          <p>Stocks: {item.product.stocks}</p>
        </div>
      </li>
    );
  });

  let totalAmount = 0;
  cart.forEach((item) => (totalAmount += item.product.price));
  return (
    <div>
      <div
        className={`fixed bottom-5 right-5 ${
          startAnime && "add-item-animation"
        }`}
        onAnimationEnd={() => setAnime(null)}
      >
        <div className="indicator">
          <div className="tooltip" data-tip="Shopping Cart">
            {!!cart.length && (
              <span className="indicator-item badge badge-primary">
                {cart.length}
              </span>
            )}
            <button
              className="btn btn-accent border-neutral ring-1 rounded-3xl"
              onClick={() => setDrawer("cart")}
            >
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={() => setDrawer(null)}>
        <div className="flex flex-col bg-neutral-content min-h-screen w-96 max-w-full-screen">
          <div className="h-20 flex justify-evenly items-center">
            <h1 className="text-3xl">Shopping Cart</h1>
            <button className="absolute left-5" onClick={() => setDrawer(null)}>
              <ArrowForwardIcon />
            </button>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-5/6 h-4/6 my-10 self-center overflow-y-scroll">
            <ul>{cartDisplay}</ul>
          </div>
          <div className="flex flex-col w-4/5 self-center mb-5">
            <h2 className="self-end text-xl">Total Amount: ${totalAmount}</h2>
            <button className="btn btn-accent mt-2" onClick={handleCheckout}>
              <h2 className="text-xl">Checkout</h2>
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
