import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BACKENDURL } from "../constant";
type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
};
type order = {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function OrderListPage() {
  const { userId } = useOutletContext<outletProps>();
  const [orderList, setOrderList] = useState<order[]>([]);
  console.log(orderList);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/order/all/${userId}`);
        setOrderList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);
  return <div></div>;
}
