import axios from "axios";
import { CircularProgress } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { BACKENDURL } from "../constant";
import noImage from "./img/no-image.jpg";
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
  stock: number;
  onsale?: {
    discount: number;
  };
} | null;

type suggestProduct = {
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
};

type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  setError: Function;
};

export default function ProductPage() {
  const { productId } = useParams<params>();
  const [productInfo, setProductInfo] = useState<product>(null);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [suggestCategory, setSuggestCategory] = useState<string>("");
  const [suggestProducts, setSuggestProducts] = useState<suggestProduct[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const { handleAddWishItem, handleAddCart, setError } =
    useOutletContext<outletProps>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingProduct(true);
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
        let randomIndex = Math.floor(Math.random() * flatCategoryList.length);
        let randomCategory = flatCategoryList[randomIndex];
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
        setIsLoadingProduct(false);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Sorry, cannot load this product for now.",
        });
      }
    };
    fetchData();
  }, [productId, setError]);
  if (!photoList.length) {
    photoList.push(noImage);
  }
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
      to={`/search?category=${name}`}
    >
      {name}
    </Link>
  ));

  const productDisplay = (
    <div className="mx-5 sm:w-1/2 space-y-3">
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
        <span>stock: {productInfo?.stock}</span>
      </div>
      <div className="flex justify-between space-x-3">
        <button
          className="btn w-1/2"
          onClick={() => handleAddWishItem(productId)}
        >
          <StarsIcon />
        </button>
        <button
          className="btn w-1/2"
          onClick={() => handleAddCart(productId)}
          disabled={!productInfo?.stock}
        >
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
      <div className="my-3 w-5/6 h flex flex-col sm:flex-row items-center bg-base-300 rounded-box">
        <div className="my-2 flex flex-col w-5/6 sm:w-3/5 items-center">
          <div className="my-2 carousel w-80 rounded-box">{photoDisplay}</div>
          <div className="flex justify-center w-full py-2 gap-2">
            {photoButtonDisplay}
          </div>
        </div>
        {productDisplay}
      </div>
      <div className="w-5/6 flex flex-col">
        {!!suggestProducts.length && (
          <span className="text-xl">You may also interested in: </span>
        )}
        {!!suggestProducts.length && (
          <Link
            to={`/search?category=${suggestCategory}`}
            className="self-start btn btn-link btn-lg btn"
          >
            {suggestCategory}:
          </Link>
        )}
        {isLoadingProduct ? (
          <CircularProgress className="self-center" />
        ) : (
          !!suggestProducts.length && (
            <ProductList
              products={suggestProducts}
              handleAddCart={handleAddCart}
              handleAddWishItem={handleAddWishItem}
            />
          )
        )}
      </div>
    </div>
  );
}
