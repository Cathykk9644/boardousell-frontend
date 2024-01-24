import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
        url: string;
        createdAt: Date;
        updatedAt: Date;
      }
    ];
  } | null;
};

export default function ProductCard(props: props) {
  const productDetail = props.product;
  return !productDetail ? null : (
    <div className="card w-40 bg-secondary shadow-xl">
      <img
        className="m-1 max-h-32 object-contain"
        src={productDetail.productPhotos[0].url}
      />
      <div className="card-body p-1">
        <h2 className="card-title">{productDetail.name}</h2>
        <div className="flex justi">
          <p>HKD${productDetail.price}</p>
          <p>Stocks: {productDetail.stocks}</p>
        </div>
      </div>
      <div className="card-actions flex justify-evenly m-1">
        <button className="btn">
          <StarsIcon />
        </button>
        <button className="btn" disabled={!productDetail.stocks}>
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}
