import { useParams } from "react-router-dom";

type params = {
  productId: string;
};
export default function ProductPage() {
  const { productId } = useParams();
  return <div>{productId}</div>;
}
