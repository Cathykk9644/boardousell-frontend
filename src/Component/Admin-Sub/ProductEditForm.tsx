import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CircularProgress } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { storage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  productPhotos: {
    id: number;
    url: string;
    thumbnail: boolean;
    fileName: string;
  }[];
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

type editType = "name" | "stocks" | "price" | "discount" | "description" | null;
export default function ProductEditForm({
  product,
  categories,
  open,
  setOpen,
  setErrMsg,
  setProducts,
}: props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editType, setEditType] = useState<editType>(null);
  const [editInput, setEditInput] = useState<string>("");
  const [fileValue, setFileValue] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string[]>([]);

  const handleChange = () => {
    if (open) {
      setOpen(null);
    } else setOpen(product.id);
  };

  const handleCheckBox = () => {};

  const handleChangeNewProduct = async (isNew: boolean) => {
    try {
      const { data } = await axios.put(
        `${BACKENDURL}/product/newProduct/${product.id}`,
        { isNew: isNew }
      );
      updateProduct(data);
    } catch (error) {
      setErrMsg("Somethings wrong. Cannot update.");
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      if (editType === "discount") {
        if (product.onsale) {
          const { data } = await axios.put(
            `${BACKENDURL}/product/discount/${product.onsale.id}`,
            { discount: editInput }
          );
          updateProduct(data);
        }
      } else if (editType !== null) {
        const { data } = await axios.put(
          `${BACKENDURL}/product/info/${product.id}`,
          { [editType]: editInput }
        );
        updateProduct(data);
      } else {
        throw new Error();
      }
      setEditInput("");
      setEditType(null);
    } catch (error) {
      setErrMsg("Somethings wrong. Cannot update.");
      setIsLoading(false);
    }
  };

  const handleEdit = (type: editType) => {
    if (type === editType) {
      handleConfirmEdit();
      return;
    }
    switch (type) {
      case "description":
        setEditInput(product.description);
        break;
      case "discount":
        product.onsale && setEditInput(product.onsale.discount.toString());
        break;
      case "name":
        setEditInput(product.name);
        break;
      case "price":
        setEditInput(product.price.toString());
        break;
      case "stocks":
        setEditInput(product.stocks.toString());
        break;
      default:
        return;
    }
    setEditType(type);
  };

  const handleCategory = async (e: {
    target: { value: string; checked: boolean };
  }) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`${BACKENDURL}/category/product`, {
        category: e.target.value,
        link: e.target.checked,
        productId: product.id,
      });
      updateProduct(data);
    } catch (error) {
      setErrMsg("Somethings wrong. Cannot change for now");
      setIsLoading(false);
    }
  };

  const handleThumbnail = async (photoId: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(
        `${BACKENDURL}/product/photo/thumbnail/`,
        { photoId }
      );
      updateProduct(data);
    } catch (error) {
      setErrMsg("Somethings Wrong. Cannot delete for now");
      setIsLoading(false);
    }
  };

  const handleDelete = async (photoId: number, deletefileName: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(
        `${BACKENDURL}/product/photo/${photoId}`
      );
      const storageRef = ref(
        storage,
        `/product/${product.name}/${deletefileName}`
      );
      await deleteObject(storageRef);
      updateProduct(data);
    } catch (error) {
      setErrMsg("Somethings wrong. Cannot delete for now");
      setIsLoading(false);
    }
  };

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return setErrMsg("Can't find your file while uploading photo.");
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

  const handleUploadFile = async () => {
    for (const photo of product.productPhotos) {
      if (fileName.includes(photo.fileName)) {
        return setErrMsg(
          `${photo.fileName} is already in used, please changed name first.`
        );
      }
    }
    try {
      setIsLoading(true);
      for (const file of fileValue) {
        const storageRef = ref(
          storage,
          `/product/${product.name}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const { data } = await axios.post(`${BACKENDURL}/product/photo/`, {
          url,
          fileName: file.name,
          productId: product.id,
        });
        updateProduct(data);
        setIsLoading(true);
      }
      setIsLoading(false);
      setFileName([]);
      setFileValue([]);
    } catch (error) {
      console.log(error);
      setErrMsg("Somethings went wrong, cannot upload photos now.");
      setIsLoading(false);
    }
  };

  const updateProduct = (data: product) => {
    setProducts((prev: product[]) => {
      const newProducts: product[] = [...prev];
      const index = newProducts.findIndex(
        (findProduct) => findProduct.id === product.id
      );
      newProducts[index] = data;
      return newProducts;
    });
    setErrMsg("");
    setIsLoading(false);
  };

  const photoDisplay = !!product.productPhotos.length ? (
    product.productPhotos.map((photo) => {
      return (
        <div
          className="flex items-end justify-between border-2 w-full sm:w-3/4 m-1"
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
              onClick={() => handleDelete(photo.id, photo.fileName)}
            >
              <DeleteIcon />
            </button>
            <label className="label">Thumbnail:</label>
            <input
              className="checkbox"
              type="checkbox"
              disabled={photo.thumbnail}
              checked={photo.thumbnail}
              onChange={() => handleThumbnail(photo.id)}
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
            value={category}
            checked={!!hashProductCat[category]}
            onChange={handleCategory}
          />
        </td>
      </tr>
    );
  });

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

  return (
    <Accordion expanded={open} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ width: "70%" }}>{product.name}</Typography>
        <Typography sx={{ width: "30%" }}>Stocks: {product.stocks}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
          <CircularProgress />
        </Backdrop>
        <table className="table border-b-2 border-neutral">
          <tbody>
            <tr>
              <th>Name:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={editType === "name" ? editInput : product.name}
                  disabled={editType !== "name"}
                  onChange={(e) => setEditInput(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-square"
                  onClick={() => handleEdit("name")}
                >
                  {editType === "name" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>Stocks:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={editType === "stocks" ? editInput : product.stocks}
                  disabled={editType !== "stocks"}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setEditInput(e.target.value);
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-square"
                  onClick={() => handleEdit("stocks")}
                >
                  {editType === "stocks" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>Price:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={editType === "price" ? editInput : product.price}
                  disabled={editType !== "price"}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setEditInput(e.target.value);
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-square"
                  onClick={() => handleEdit("price")}
                >
                  {editType === "price" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>New Product:</th>
              <td>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={!!product.newproduct}
                  onChange={(e) => handleChangeNewProduct(e.target.checked)}
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
                <td className="flex justify-between">
                  <input
                    className="input input-sm w-3/4"
                    type="input"
                    value={
                      editType === "discount"
                        ? editInput
                        : product.onsale.discount
                    }
                    disabled={editType !== "discount"}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        setEditInput(e.target.value);
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm btn-square"
                    onClick={() => handleEdit("discount")}
                  >
                    {editType === "discount" ? (
                      <DoneRoundedIcon />
                    ) : (
                      <EditRoundedIcon />
                    )}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-4">
          <b className="text-md">Photos:</b>
          <div className="flex flex-wrap">{photoDisplay}</div>
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
              <tfoot>
                <tr>
                  <th>
                    <button
                      className="btn-sm btn flex flex-row items-center"
                      onClick={handleUploadFile}
                    >
                      Sumbit
                      <UploadFileIcon />
                    </button>
                  </th>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
        <div className="p-4 flex flex-col">
          <b className="text-md">Description:</b>
          <textarea
            className="textarea h-36"
            value={editType === "description" ? editInput : product.description}
            disabled={editType !== "description"}
            onChange={(e) => setEditInput(e.target.value)}
          />
          <button
            className="btn btn-sm mt-2 btn-neutral"
            onClick={() => handleEdit("description")}
          >
            {editType === "description" ? (
              <DoneRoundedIcon />
            ) : (
              <EditRoundedIcon />
            )}
          </button>
        </div>
        <div className="p-4 space-y-2">
          <b className="text-xl ">Category:</b>
          <table className="table">
            <tbody>{categoryDisplay}</tbody>
          </table>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
