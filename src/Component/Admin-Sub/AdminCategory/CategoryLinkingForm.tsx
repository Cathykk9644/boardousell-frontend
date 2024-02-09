import { Dialog, DialogContent, DialogTitle, List } from "@mui/material";
import { useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import axios from "axios";
import { BACKENDURL } from "../../../constant";

type props = {
  category: {
    id: number;
    name: string;
  };
  setLinking: Function;
};
type product = {
  id: number;
  name: string;
};

export default function CategoryLinkingForm({ category, setLinking }: props) {
  const [errMsg, setErrMsg] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [products, setProducts] = useState<product[]>([]);
  const [linkedProducts, setLinkedProducts] = useState<{
    [key: number]: product;
  }>();
  const [isLoading, setIsloading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const { data }: { data: product[] } = await axios.get(
          `${BACKENDURL}/category/product/${category.id}`
        );
        const linkedProductHash: { [key: number]: product } = {};
        for (const product of data) {
          linkedProductHash[product.id] = product;
        }
        setLinkedProducts(linkedProductHash);
        setIsloading(false);
      } catch (error) {
        setErrMsg("Cannot get data, please try again");
        setIsloading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      setIsloading(true);
      if (!input.length) {
        return setErrMsg("Please Enter Keyword");
      }
      const { data } = await axios.get(
        `${BACKENDURL}/product/search/all/${input}`
      );
      setProducts(data);
      setIsloading(false);
      setInput("");
      setErrMsg("");
    } catch (error) {
      setIsloading(false);
      setErrMsg("Somethings went wrong, cannot search now.");
    }
  };

  console.log(products);
  const productDisplay = products.map((product) => {
    return <div key={product.id}></div>;
  });

  return (
    <Dialog open={!!category} fullWidth>
      <DialogTitle className="flex justify-between">
        {category.name}
        <button
          className="btn btn-sm btn-square"
          onClick={() => setLinking(null)}
        >
          <CloseRoundedIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        {!!errMsg.length && <span className="text-error m-1 ">{errMsg}</span>}
        <div className="w-full flex flex-col">
          <span className="text-xl ">Search:</span>
          <div className="w-full flex space-x-3">
            <input
              className="input input-sm w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-sm btn-square" onClick={handleSearch}>
              <SearchRoundedIcon />
            </button>
          </div>
          <span className="text-xl">Product:</span>
          <List className="h-96 overflow-y-scroll border-accent border-2 bg-base-300">
            {productDisplay}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
}
