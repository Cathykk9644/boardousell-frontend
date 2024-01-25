import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
type props = {
  userEmail: string;
};

export default function ShoppingCart(props: props) {
  return (
    <div>
      <button className="btn btn-accent border-neutral ring-1 rounded-3xl fixed bottom-5 right-5">
        <ShoppingCartIcon />
      </button>
    </div>
  );
}
