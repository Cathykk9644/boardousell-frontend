import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
type props = {
  userEmail: string;
};

export default function ShoppingCart(props: props) {
  return (
    <div>
      <div
        className="tooltip fixed bottom-16 right-12"
        data-tip="Shopping Cart"
      >
        <button className="btn btn-accent border-neutral ring-1 rounded-3xl fixed bottom-5 right-5">
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}
