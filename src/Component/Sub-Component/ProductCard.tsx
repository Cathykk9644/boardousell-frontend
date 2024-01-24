import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import noImage from "../img/no-image.jpg";
type props = {
  product: {
    id: number;
    price: number;
    name: string;
    description: string;
    stocks: number;
    createdAt: Date;
    updatedAt: Date;
    newproduct: {
      id: number;
      productId: number;
      createdAt: Date;
      updatedAt: Date;
    };
    productPhotos: [
      {
        id: number;
        productId: number;
        url?: string;
        createdAt: Date;
        updatedAt: Date;
      }
    ];
  } | null;
};

export default function ProductCard(props: props) {
  const productDetail = props.product;
  return !productDetail ? null : (
    <div className="card w-44 mt-3 bg-secondary shadow-xl">
      <img
        className="m-1 h-32 object-contain"
        src={
          productDetail.productPhotos[0].url
            ? productDetail.productPhotos[0].url
            : noImage
        }
        alt={productDetail.name}
      />
      <div className="card-body p-1">
        <h2 className="card-title ">{productDetail.name}</h2>
        <div className="flex">
          <p>HKD${productDetail.price}</p>
          <p>Stocks: {productDetail.stocks}</p>
        </div>
      </div>
      <div className="card-actions flex justify-end mb-1 mr-1">
        <button className="btn w-11 h-11">
          <StarsIcon />
        </button>
        <button className="btn w-11 h-11" disabled={!productDetail.stocks}>
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}
