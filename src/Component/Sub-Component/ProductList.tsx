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
    let count: number = 1;
    const currentList: product[] = [];
    for (const product of products) {
      currentList.push(product);
      count++;
      if (count === 4) {
        dividedList.push(currentList);
        count = 0;
        currentList.splice(0, 4);
      }
    }
    if (currentList.length) {
      dividedList.push(currentList);
    }
  }
  console.log(dividedList);
  return <div></div>;
}
