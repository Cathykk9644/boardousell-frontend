import axios from "axios";
import { CircularProgress } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { BACKENDURL } from "../constant";
import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductList from "./Sub-Component/ProductList";

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

type suggestProduct = {
  id: number;
  price: number;
  name: string;
  stocks: number;
  onsale?: {
    discount: number;
  };
  productPhotos: [
    {
      url?: string;
    }
  ];
};

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
};

//Need to add Link to categories
export default function ProductPage() {
  const { productId } = useParams<params>();
  const [productInfo, setProductInfo] = useState<product>(null);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [suggestCategory, setSuggestCategory] = useState<string>("");
  const [suggestProducts, setSuggestProducts] = useState<suggestProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleAddWishItem, handleAddCart } = useOutletContext<outletProps>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${BACKENDURL}/product/info/${productId}`
        );
        const { productPhotos, categories, ...product } = data;
        const flatPhotoList = productPhotos.map(
          (item: { url: string }) => item.url
        );
        const flatCategoryList = categories.map(
          (item: { name: string }) => item.name
        );
        const randomIndex = Math.floor(Math.random() * flatCategoryList.length);
        const randomCategory = flatCategoryList[randomIndex];
        const suggestProductRes: { data: suggestProduct[] } = await axios.get(
          `${BACKENDURL}/category/suggest/${randomCategory}`
        );
        const filterSuggestProducts = suggestProductRes.data.filter(
          (item) => item.id !== Number(productId)
        );
        setProductInfo(product);
        setPhotoList(flatPhotoList);
        setCategoryList(flatCategoryList);
        setSuggestCategory(randomCategory);
        setSuggestProducts(filterSuggestProducts);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const photoButtonDisplay: ReactElement[] = [];
  const photoDisplay = photoList.map((url: string, i: number) => {
    photoButtonDisplay.push(
      <a key={`button${i + 1}`} className="btn btn-xs" href={`#photo${i + 1}`}>
        {i + 1}
      </a>
    );
    return (
      <div
        id={`photo${i + 1}`}
        className="carousel-item w-full"
        key={`Photo${i + 1}`}
      >
        <img src={url} alt={`${i}`} />
      </div>
    );
  });

  const categoriesInProduct = categoryList.map((name) => (
    <Link
      key={name}
      className="btn btn-link btn-xs px-2"
      to={`/serach/${name}`}
    >
      {name}
    </Link>
  ));

  const productDisplay = (
    <div className="mx-5 space-y-3">
      <h1 className="text-3xl font-bold">{productInfo?.name}</h1>

      <p>{productInfo?.description}</p>
      <span>Categories: </span>
      <div className="flex justify-between text-xl">
        <span>
          Price:{" "}
          <span className={productInfo?.onsale && "line-through"}>
            ${productInfo?.price}
          </span>
          {productInfo?.onsale && (
            <span>
              {` $${Math.round(
                productInfo.price * productInfo.onsale.discount
              )}`}
            </span>
          )}
        </span>
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
        <div className="my-2 flex flex-col items-center">
          <div className="my-2 carousel w-5/6 sm:w-2/5 rounded-box">
            {photoDisplay}
          </div>
          <div className="flex justify-center w-full py-2 gap-2">
            {photoButtonDisplay}
          </div>
        </div>
        <div>{productDisplay}</div>
      </div>
      <div className="w-5/6 flex flex-col">
        <span className="text-xl">You may also interested in: </span>
        <Link
          to={`/serach/${suggestCategory}`}
          className="self-start ml-5 btn btn-link btn-lg btn"
        >
          {suggestCategory}:
        </Link>
        {isLoading ? (
          <CircularProgress className="self-center" />
        ) : (
          <ProductList
            products={suggestProducts}
            handleAddCart={handleAddCart}
            handleAddWishItem={handleAddWishItem}
          />
        )}
      </div>
    </div>
  );
}
