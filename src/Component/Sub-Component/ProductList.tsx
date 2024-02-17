import { Pagination } from "@mui/material";
import ProductCard from "./ProductCard";
import React, { useState } from "react";

type product = {
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

type products = product[];

type props = {
  products: products;
  handleAddWishItem: Function;
  handleAddCart: Function;
};

export default function ProductList({
  products,
  handleAddWishItem,
  handleAddCart,
}: props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startAnimation, setStartAnimation] = useState<string>();
  const dividedList: products[] = [];

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    setStartAnimation(`page${currentPage}to${value}`);
  };

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

  const animationArr: string[] = [];

  for (let i = 1; i <= dividedList.length; i++) {
    for (let j = 1; j <= dividedList.length; j++) {
      if (i === j) continue;
      const newAnimation = `@keyframes page${i}to${j}{
      0%{transform:translate(-${(i - 1) * 100}%);}
      100%{transform:translate(-${(j - 1) * 100}%);}
      }`;
      animationArr.push(newAnimation);
    }
  }
  const productAllList = products
    ? dividedList.map((productGroup, i) => {
        const productGroupList = productGroup?.map((product, j) => {
          return (
            <ProductCard
              product={product}
              handleAddWishItem={handleAddWishItem}
              handleAddCart={handleAddCart}
              key={`page${i + 1}product${j + 1}`}
            />
          );
        });
        while (productGroupList && productGroupList.length < 4 && i !== 0) {
          productGroupList.push(
            <div
              className="card w-44 h-72 mt-3"
              key={`page${i + 1}product${productGroupList.length + 1}`}
            ></div>
          );
        }

        return (
          <div
            className="min-w-full flex flex-row justify-evenly flex-wrap"
            key={`page${i + 1}`}
            style={{
              transform: `translate(-${(currentPage - 1) * 100}%)`,
              animationName: startAnimation,
              animationDuration: "0.5s",
            }}
          >
            {productGroupList}
          </div>
        );
      })
    : null;

  return (
    products && (
      <div className="flex flex-col items-center w-full mb-5">
        {animationArr.map((animation, i) => (
          <style key={`animation${i}`}>{animation}</style>
        ))}
        <div className="overflow-x-hidden w-96 md:w-5/6 flex flex-row ">
          {productAllList}
        </div>
        <Pagination
          count={dividedList.length}
          onChange={handleChange}
          className="mt-5"
        />
      </div>
    )
  );
}
