import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { BACKENDURL } from "../../../constant";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { category, product } from "../../../type";
import { useAuth0 } from "@auth0/auth0-react";

type props = {
  open: boolean;
  categories: category[];
  setIsAdding: Function;
  setNewAddedProducts: Function;
};

type newData = {
  name: string;
  price: string;
  description: string;
  stock: string;
};

export default function ProductAddForm({
  open,
  categories,
  setIsAdding,
  setNewAddedProducts,
}: props) {
  const [newData, setNewData] = useState<newData>({
    name: "",
    price: "1000",
    description: "",
    stock: "0",
  });
  const [fileValue, setFileValue] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(true);
  const [isOnsale, setInOnsale] = useState<boolean>(false);
  const [discount, setDiscount] = useState<string>("1");
  const [errMsg, setErrMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const newFileNames = [...fileName];
    const newFileValue = [...fileValue];
    for (const file of e.target.files) {
      if (!newFileNames.includes(file.name)) {
        newFileNames.push(file.name);
        newFileValue.push(file);
      }
    }
    setFileName([...newFileNames]);
    setFileValue([...newFileValue]);
  };

  const handleDeleteFile = (name: string) => {
    setFileName((prev) => prev.filter((fileName) => fileName !== name));
    setFileValue((prev) => prev.filter((file) => file.name !== name));
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCategory((prev) => [...prev, e.target.value]);
    } else {
      setSelectedCategory((prev) =>
        prev.filter((name) => name !== e.target.value)
      );
    }
  };

  const handleAddProduct = async () => {
    if (!newData.name.length) {
      return setErrMsg("Please Add Product Name First.");
    }
    if (!newData.price.length) {
      return setErrMsg("Please Add Price First.");
    }
    if (!newData.stock.length) {
      return setErrMsg("Please Add Stock First");
    }
    if (isOnsale && !discount.length) {
      return setErrMsg("Please Add Discount First.");
    }
    try {
      setIsLoading(true);
      let data: product & { categories: category[] };
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const inputData = {
        ...newData,
        isNewProduct,
        isOnsale,
        discount,
        categories: selectedCategory,
      };
      const res = await axios.post(
        `${BACKENDURL}/admin/product/create`,
        inputData,
        config
      );
      data = res.data;

      for (const file of fileValue) {
        const storageRef = ref(
          storage,
          `/product/${newData.name}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const fileRes = await axios.post(
          `${BACKENDURL}/admin/product/photo/`,
          {
            url,
            fileName: file.name,
            productId: data.id,
          },
          config
        );
        data.productPhotos.push(fileRes.data);
      }

      setNewAddedProducts((prev: product[]) => [...prev, data]);
      setNewData({ name: "", price: "", description: "", stock: "" });
      setFileValue([]);
      setFileName([]);
      setSelectedCategory([]);
      setIsNewProduct(true);
      setInOnsale(false);
      setDiscount("");
      setErrMsg("");
      setIsLoading(false);
      setIsAdding(false);
    } catch (err) {
      setIsLoading(false);
      setErrMsg("Oh. Somethings went wrong. Cannot add this product.");
    }
  };

  const inputFileDisplay = fileName.map((name) => (
    <tr key={name}>
      <td className="table-cell ">{name}</td>
      <td>
        <button
          className="btn btn-sm btn-square btn-ghost"
          onClick={() => handleDeleteFile(name)}
        >
          <DeleteIcon />
        </button>
      </td>
    </tr>
  ));

  const hashProductCat: { [key: string]: boolean } = {};
  for (const category of selectedCategory) {
    hashProductCat[category] = true;
  }
  const categoryDisplay = categories.map((category) => {
    return (
      <tr key={category.id}>
        <th>{category.name}</th>
        <td>
          <input
            className="checkbox"
            type="checkbox"
            value={category.name}
            checked={!!hashProductCat[category.name]}
            onChange={handleSelectCategory}
          />
        </td>
      </tr>
    );
  });

  return (
    <Dialog open={open}>
      <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
        <CircularProgress />
      </Backdrop>
      <DialogTitle className="flex justify-between">
        <div>Add Product:</div>
        <button
          className="btn btn-square btn-sm"
          onClick={() => setIsAdding(false)}
        >
          <CloseRoundedIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        <table className="table border-b-2 border-neutral">
          <tbody>
            <tr>
              <th>Name:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={newData.name}
                  onChange={(e) =>
                    setNewData({ ...newData, name: e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <th>Stock:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={newData.stock}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setNewData({ ...newData, stock: e.target.value });
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Price:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={newData.price}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setNewData({ ...newData, price: e.target.value });
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>New Product:</th>
              <td>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={isNewProduct}
                  onChange={(e) => setIsNewProduct(e.target.checked)}
                />
              </td>
            </tr>
            <tr>
              <th>On sale:</th>
              <td>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={isOnsale}
                  onChange={(e) => setInOnsale(e.target.checked)}
                />
              </td>
            </tr>
            {!!isOnsale && (
              <tr>
                <th>Discount:</th>
                <td className="flex justify-between">
                  <input
                    className="input input-sm w-3/4"
                    type="input"
                    value={discount}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        setDiscount(e.target.value);
                      }
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-4">
          <div className="mt-3">
            <b>Upload photo: </b>
            <input
              className="file-input file-input-sm"
              type="file"
              accept="image/png, image/jpeg"
              multiple
              onChange={handleAddFile}
            />
          </div>
          {!!fileName.length && (
            <table className="table border border-2 border-neutral">
              <tbody>
                <tr>
                  <th>Uploaded Photos:</th>
                  <td></td>
                </tr>
                {inputFileDisplay}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 flex flex-col">
          <b className="text-md">Description:</b>
          <textarea
            className="textarea h-36"
            value={newData.description}
            onChange={(e) =>
              setNewData({ ...newData, description: e.target.value })
            }
          />
        </div>
        <div className="p-4 space-y-2">
          <b className="text-xl ">Category:</b>
          <table className="table">
            <tbody>{categoryDisplay}</tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions className="flex flex-col items-center">
        <span className="text-error m-1">{errMsg}</span>
        <button className="btn btn-wide btn-accent" onClick={handleAddProduct}>
          Add
        </button>
      </DialogActions>
    </Dialog>
  );
}
