import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { BACKENDURL } from "../constant";
import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

type params = {
  productId: string;
};

type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  onsale?: {
    discount: number;
  };
} | null;

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
};

//Need to add redirect to categories
export default function ProductPage() {
  const { productId } = useParams();
  const [productInfo, setProductInfo] = useState<product>(null);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const { handleAddWishItem, handleAddCart } = useOutletContext<outletProps>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BACKENDURL}/product/info/${productId}`
        );
        const { productPhotos, categories, ...product } = data;
        setProductInfo(product);
        const flatPhotoList = productPhotos.map(
          (item: { url: string }) => item.url
        );
        setPhotoList(flatPhotoList);
        const flatCategoryList = categories.map(
          (item: { name: string }) => item.name
        );
        setCategoryList(flatCategoryList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [productId]);

  const photoButtonDisplay: ReactElement[] = [];
  const photoDisplay = photoList.map((url: string, i: number) => {
    photoButtonDisplay.push(
      <a className="btn btn-xs" href={`#photo${i + 1}`}>
        {i + 1}
      </a>
    );
    return (
      <div
        id={`photo${i + 1}`}
        className="carousel-item w-full"
        key={`Photo${i + 1}`}
      >
        <img src={url} alt={`Photo${i}`} />
      </div>
    );
  });

  const categoriesInProduct = categoryList.map((name) => (
    <Link className="btn btn-link btn-xs px-2" to={`/serach/${name}`}>
      {name}
    </Link>
  ));

  const productDisplay = (
    <div className="m-5 space-y-3">
      <h1 className="text-3xl font-bold">{productInfo?.name}</h1>

      <p>{productInfo?.description}</p>
      <span>Categories: </span>
      <div className="flex justify-between text-xl">
        <span className="">Price: ${productInfo?.price}</span>
        <span>Stocks: {productInfo?.stocks}</span>
      </div>
      <div className="flex justify-between space-x-3">
        <button
          className="btn w-1/2"
          onClick={() => handleAddWishItem(productId)}
        >
          <StarsIcon />
        </button>
        <button className="btn w-1/2" onClick={() => handleAddCart(productId)}>
          <ShoppingCartIcon />
        </button>
      </div>
      <div className="flex flex-wrap items-center">
        <span>Categories:</span>
        {categoriesInProduct}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="my-3 w-5/6 flex flex-col sm:flex-row items-center bg-base-300 rounded-box">
        <div className="flex flex-col items-center">
          <div className="my-2 carousel w-5/6 sm:w-2/5 rounded-box">
            {photoDisplay}
          </div>
          <div className="flex justify-center w-full py-2 gap-2">
            {photoButtonDisplay}
          </div>
        </div>
        <div>{productDisplay}</div>
      </div>
    </div>
  );
}
