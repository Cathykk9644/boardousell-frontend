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
    <div className="card flex flex-col items-center w-72 p-6 bg-accent text-accent-content rounded-3xl shadow-xl m-3">
      <img
        className="w-56 h-44 object-contain cursor-pointer"
        onClick={() => navi(`../product/${product.id}`)}
        src={productPhoto}
        alt={product.name}
      />

      <div className="card-body flex flex-col w-full p-1">
        <div>
          <h1
            className="cursor-pointer text-lg"
            onClick={() => navi(`../product/${product.id}`)}
          >
            {product.name}
          </h1>
          {product.onsale ? (
            <div className="flex w-full">
              <b className="text-red-600">
                HKD${Math.round(product.price * product.onsale.discount)}
              </b>
              <h1 className="line-through">HKD${product.price}</h1>
            </div>
          ) : (
            <b>{`HKD$${product.price}`}</b>
          )}
        </div>
      </div>
      <div className="card-actions justify-between w-full flex justify-between">
        <span className="self-center">stock: {product.stock}</span>
        <div className="space-x-3">
          <button
            className="btn btn-square w-12 h-12 rounded-md"
            onClick={() => handleAddItem(product.id, "wishlist")}
          >
            <StarsIcon />
          </button>
          <button
            className="btn btn-square w-12 h-12 rounded-md"
            disabled={!product.stock}
            onClick={() => handleAddItem(product.id, "cart")}
          >
            <ShoppingCartIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
