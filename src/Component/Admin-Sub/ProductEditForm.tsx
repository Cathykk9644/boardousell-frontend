type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  productPhotos?: [{ id: number; url: string }];
  categories?: [{ id: number; name: string }];
  newproduct?: [{ id: number }];
  onsale?: [{ id: number; discount: number }];
};

export default function ProductEditForm({
  product,
  categories,
}: {
  product: product;
  categories: string[];
}) {
  return <div></div>;
}
