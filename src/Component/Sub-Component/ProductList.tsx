import { Pagination } from "@mui/material";
import ProductCard from "./ProductCard";

type product = {
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

type products = product[] | null;

type props = {
  products: products;
};

export default function ProductList({ products }: props) {
  const dividedList: products[] = [];
  if (products) {
    let count: number = 0;
    let currentList: product[] = [];
    for (const product of products) {
      currentList.push(product);
      count++;
      if (count === 4) {
        dividedList.push(currentList);
        count = 0;
        currentList = [];
      }
    }
    if (currentList.length) {
      dividedList.push(currentList);
    }
  }
  const productAllList = products
    ? dividedList.map((productGroup) => {
        const productGroupList = productGroup?.map((product) => {
          return <ProductCard product={product} />;
        });
        while (productGroupList && productGroupList.length < 4) {
          productGroupList.push(<div className="card w-44 h-64 mt-3"></div>);
        }

        return (
          <div className="min-w-full flex flex-row justify-evenly flex-wrap">
            {productGroupList}
          </div>
        );
      })
    : null;
  return (
    products && (
      <div className="flex flex-col items-center">
        <div className="overflow-x-scroll min-w-full flex flex-row">
          {productAllList}
        </div>
        <Pagination count={dividedList.length} />
      </div>
    )
  );
}
