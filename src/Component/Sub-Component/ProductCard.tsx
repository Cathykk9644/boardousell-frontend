import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import noImage from "../img/no-image.jpg";
import { useNavigate } from "react-router-dom";
import { product } from "../../type";
type props = {
  handleAddItem: Function;
  product: product;
};

export default function ProductCard({
  product,
  handleAddItem,
}: props): JSX.Element {
  const navi = useNavigate();
  let productPhoto = noImage;
  for (const photo of product.productPhotos) {
    if (photo.thumbnail) {
      productPhoto = photo.url;
    }
  }
  return (
    <div className="card w-44 m-2 md:w-52 bg-accent text-accent-content shadow-xl">
      <img
        className="my-5 h-32 object-contain cursor-pointer"
        onClick={() => navi(`../product/${product.id}`)}
        src={productPhoto}
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
          onClick={() => handleAddItem(product.id, "wishlist")}
        >
          <StarsIcon />
        </button>
        <button
          className="btn w-11 h-11"
          disabled={!product.stock}
          onClick={() => handleAddItem(product.id, "cart")}
        >
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}
