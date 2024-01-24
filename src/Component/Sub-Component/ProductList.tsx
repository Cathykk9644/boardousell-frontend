import { Pagination } from "@mui/material";
import ProductCard from "./ProductCard";
import React, { useState } from "react";

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
      url?: string;
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
              key={`page${i + 1}product${j + 1}`}
            />
          );
        });
        while (productGroupList && productGroupList.length < 4) {
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

  console.log(animationArr);
  return (
    products && (
      <div className="flex flex-col items-center ">
        {animationArr.map((animation) => (
          <style>{animation}</style>
        ))}
        <div className="overflow-x-hidden w-96 md:w-full flex flex-row ">
          {productAllList}
        </div>
        <Pagination count={dividedList.length} onChange={handleChange} />
      </div>
    )
  );
}
