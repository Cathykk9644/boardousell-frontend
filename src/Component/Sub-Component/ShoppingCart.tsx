import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Drawer } from "@mui/material";

type item = {
  id: number;
  product: {
    price: number;
    name: string;
    stocks: number;
  };
};

type props = {
  open: boolean;
  setDrawer: Function;
  cart: item[];
};

//Need to develop order function
export default function ShoppingCart({ open, setDrawer, cart }: props) {
  const handleDelete = (cartId: number) => {};
  const cartDisplay = cart.map((item: item, i: number) => {
    return (
      <li
        className={`flex items-center ${
          i % 2 === 0 ? "bg-primary" : "bg-secondary"
        }`}
        key={item.id}
      >
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
      <div className="fixed bottom-5 right-5">
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
          <div className="bg-base-100 w-4/5 h-5/6 self-center my-auto">
            <ul>{cartDisplay}</ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
