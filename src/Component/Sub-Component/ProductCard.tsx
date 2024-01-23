interface props {
  product: {
    id: number;
    price: number;
    name: string;
    description: string;
    stocks: number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export default function ProductCard(props: props) {
  return <div></div>;
}
