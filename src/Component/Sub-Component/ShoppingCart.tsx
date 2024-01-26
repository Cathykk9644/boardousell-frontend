import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
type props = {
  userId: number;
};

export default function ShoppingCart(props: props) {
  return (
    <div>
      <div className="fixed bottom-5 right-5">
        <div className="tooltip" data-tip="Shopping Cart">
          <button className="btn btn-accent border-neutral ring-1 rounded-3xl">
            <ShoppingCartIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
