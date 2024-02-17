import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import noImage from "../img/no-image.jpg";
import { useNavigate } from "react-router-dom";
type props = {
  handleAddWishItem: Function;
  handleAddCart: Function;
  product: {
    id: number;
    price: number;
    name: string;
    stock: number;
    onsale?: {
      discount: number;
    };
    productPhotos: [
      {
        url?: string;
      }
    ];
  } | null;
};

//Need to add shopping Cart function
export default function ProductCard({
  product,
  handleAddWishItem,
  handleAddCart,
}: props) {
  const navi = useNavigate();

  return !product ? null : (
    <div className="card w-44 m-2 md:w-52 bg-accent text-accent-content shadow-xl">
      <img
        className="my-5 h-32 object-contain cursor-pointer"
        onClick={() => navi(`../product/${product.id}`)}
        src={
          product.productPhotos.length ? product.productPhotos[0].url : noImage
        }
        alt={product.name}
      />
      <div className="card-body flex flex-col items-center p-1">
        <h2
          className="card-title cursor-pointer"
          onClick={() => navi(`../product/${product.id}`)}
        >
          {product.name}
        </h2>
        <div className="flex flex-row w-full justify-between items-center">
          {product.onsale ? (
            <div className="flex flex-col">
              <span className="line-through">HKD${product.price}</span>
              <span>
                HKD${Math.round(product.price * product.onsale.discount)}
              </span>
            </div>
          ) : (
            <span>HKD${product.price}</span>
          )}
          <span>stock: {product.stock}</span>
        </div>
      </div>
      <div className="card-actions flex justify-end mb-1 mr-1">
        <button
          className="btn w-11 h-11"
          onClick={() => handleAddWishItem(product.id)}
        >
          <StarsIcon />
        </button>
        <button
          className="btn w-11 h-11"
          disabled={!product.stock}
          onClick={() => handleAddCart(product.id)}
        >
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}
