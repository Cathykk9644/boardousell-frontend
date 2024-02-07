import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

import { CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import axios from "axios";
import { BACKENDURL } from "../../constant";

type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  productPhotos: { id: number; url: string; thumbnail: boolean }[];
  categories: { id: number; name: string }[];
  newproduct?: { id: number };
  onsale?: { id: number; discount: number };
};
type props = {
  product: product;
  categories: string[];
  open: boolean;
  setOpen: Function;
  setErrMsg: Function;
  setProducts: Function;
};

type editType = "name" | "Stocks" | "Price" | "Description";
export default function ProductEditForm({
  product,
  categories,
  open,
  setOpen,
  setErrMsg,
  setProducts,
}: props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = () => {
    if (open) {
      setOpen(null);
    } else setOpen(product.id);
  };

  const handleCheckBox = () => {};
  const handleDelete = async (photoId: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(
        `${BACKENDURL}/product/photo/${photoId}`
      );
      setProducts((prev: product[]) => {
        const newProducts: product[] = [...prev];
        const index = newProducts.findIndex(
          (findProduct) => findProduct.id === product.id
        );
        newProducts[index] = data;
        return newProducts;
      });
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Cannot delete for now");
    }
  };

  const photoDisplay = !!product.productPhotos.length ? (
    product.productPhotos.map((photo) => {
      return (
        <div
          className="flex items-end justify-between border-2 w-full sm:w-1/2 m-1"
          key={photo.id}
        >
          <a href={photo.url} target="_blank">
            <img
              className="w-32 m-3"
              src={photo.url}
              alt={photo.id.toString()}
            />
          </a>
          <div className="flex flex-col items-center m-5">
            <button
              className="btn btn-sm btn-square"
              onClick={() => handleDelete(photo.id)}
            >
              <DeleteIcon />
            </button>
            <label className="label">Thumbnail:</label>
            <input
              className="checkbox"
              type="checkbox"
              checked={photo.thumbnail}
              onChange={handleCheckBox}
            />
          </div>
        </div>
      );
    })
  ) : (
    <div>No Photo Yet.</div>
  );

  const hashProductCat: { [key: string]: boolean } = {};
  for (const category of product.categories) {
    hashProductCat[category.name] = true;
  }
  const categoryDisplay = categories.map((category) => {
    return (
      <tr key={category}>
        <th>{category}</th>
        <td>
          <input
            className="checkbox"
            type="checkbox"
            checked={hashProductCat[category]}
            onChange={handleCheckBox}
          />
        </td>
      </tr>
    );
  });

  return (
    <Accordion expanded={open} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ width: "70%" }}>{product.name}</Typography>
        <Typography sx={{ width: "30%" }}>Stocks: {product.stocks}</Typography>
      </AccordionSummary>

      {isLoading ? (
        <AccordionDetails>
          <CircularProgress />
        </AccordionDetails>
      ) : (
        <AccordionDetails>
          <table className="table border-b-2 border-neutral">
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{product.name}</td>
              </tr>
              <tr>
                <th>Stocks:</th>
                <td>{product.stocks}</td>
              </tr>
              <tr>
                <th>Price:</th>
                <td>{product.price}</td>
              </tr>
              <tr>
                <th>New Product:</th>
                <td>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={!!product.newproduct}
                    onChange={handleCheckBox}
                  />
                </td>
              </tr>
              <tr>
                <th>On sale:</th>
                <td>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={!!product.onsale}
                    onChange={handleCheckBox}
                  />
                </td>
              </tr>
              {!!product.onsale && (
                <tr>
                  <th>Discount:</th>
                  <td>{product.onsale.discount}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-4">
            <b className="text-md">Photos:</b>
            <div className="flex flex-wrap">{photoDisplay}</div>
          </div>
          <div className="p-4">
            <b className="text-md">Description:</b>
            <p>{product.description}</p>
          </div>
          <div className="p-4 space-y-2">
            <b className="text-xl ">Category:</b>
            <table className="table">
              <tbody> {categoryDisplay}</tbody>
            </table>
          </div>
        </AccordionDetails>
      )}
    </Accordion>
  );
}
