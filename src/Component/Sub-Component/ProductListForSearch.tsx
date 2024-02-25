import { Pagination } from "@mui/material";
import ProductCard from "./ProductCard";
import { product } from "../../type";

type props = {
  products: product[];
  page: {
    current: number;
    total: number;
  };
  handleChangePage: Function;
  handleAddItem: Function;
};

export default function ProductListForSearch({
  page,
  handleChangePage,
  products,
  handleAddItem,
}: props): JSX.Element {
  if (!products.length) return <div>No Product Found.</div>;

  const productListDisplay = products.map((product) => {
    return (
      <ProductCard
        handleAddItem={handleAddItem}
        product={product}
        key={product.id}
      />
    );
  });

  return (
    <div className="flex flex-col items-center w-full mb-5">
      <div className="w-96 md:w-5/6 flex flex-row justify-around flex-wrap">
        {productListDisplay}
      </div>
      <Pagination
        count={page.total}
        page={page.current}
        onChange={(e, newPage) => handleChangePage(newPage)}
      />
    </div>
  );
}
