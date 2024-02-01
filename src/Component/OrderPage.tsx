import { useState } from "react";
import { Params, useParams } from "react-router-dom";

export default function OrderPage() {
  const { orderId } = useParams<Params>();
  const [orderInfo, setOrderInfo] = useState();

  return <div className="min-h-screen">{orderId}</div>;
}
