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
import { BACKENDURL } from "../../../constant";
import { storage } from "../../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { product } from "../../../type";
import { useAuth0 } from "@auth0/auth0-react";

type props = {
  product: product;
  categories: string[];
  open: boolean;
  setOpen: Function;
  setErrMsg: Function;
  setProducts: Function;
};

type edit = {
  type: "name" | "stock" | "price" | "discount" | "description" | null;
  input: string;
};
export default function ProductEditForm({
  product,
  categories,
  open,
  setOpen,
  setErrMsg,
  setProducts,
}: props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<edit>({ type: null, input: "" });
  const [fileValue, setFileValue] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  const handleChange = () => {
    if (open) {
      setOpen(null);
    } else setOpen(product.id);
  };

  const handleCheckBox = async (updateType: string, isNew: boolean) => {
    if (edit.type === "discount") {
      setEdit({ type: null, input: "" });
    }
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.put(
        `${BACKENDURL}/admin/product/${updateType}/${product.id}`,
        { isNew: isNew },
        config
      );
      updateProduct(data);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update this product.");
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (edit.type === "discount") {
        if (product.onsale) {
          const { data } = await axios.put(
            `${BACKENDURL}/admin/product/discount/${product.onsale.id}`,
            { discount: edit.input },
            config
          );
          updateProduct(data);
        }
      } else if (edit.type !== null) {
        const { data } = await axios.put(
          `${BACKENDURL}/admin/product/info/${product.id}`,
          { [edit.type]: edit.input },
          config
        );
        updateProduct(data);
      } else {
        setIsLoading(false);
        return setErrMsg("Cannot find your updating type.");
      }
      setEdit({ type: null, input: "" });
      setErrMsg("");
      setIsLoading(false);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update this product.");
      setIsLoading(false);
    }
  };

  const handleEdit = (type: edit["type"]) => {
    if (type === edit.type) {
      handleConfirmEdit();
      return;
    }
    switch (type) {
      case "description":
        setEdit({ type: type, input: product.description });
        break;
      case "discount":
        product.onsale &&
          setEdit({ type: type, input: product.onsale.discount.toString() });
        break;
      case "name":
        setEdit({ type: type, input: product.name });
        break;
      case "price":
        setEdit({ type: type, input: product.price.toString() });
        break;
      case "stock":
        setEdit({ type: type, input: product.stock.toString() });
        break;
      default:
        return;
    }
  };

  const handleCategory = async (e: {
    target: { value: string; checked: boolean };
  }) => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.put(
        `${BACKENDURL}/admin/category/product`,
        {
          category: e.target.value,
          link: e.target.checked,
          productId: product.id,
        },
        config
      );
      updateProduct(data);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot update this product.");
      setIsLoading(false);
    }
  };

  const handleThumbnail = async (photoId: number) => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.put(
        `${BACKENDURL}/admin/product/photo/thumbnail/`,
        { photoId },
        config
      );
      updateProduct(data);
    } catch (err) {
      setErrMsg(
        "Oh. Somethings went wrong. Cannot update this product thumbnail."
      );
      setIsLoading(false);
    }
  };

  const handleDelete = async (photoId: number, deletefileName: string) => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.delete(
        `${BACKENDURL}/admin/product/photo/${photoId}`,
        config
      );
      const storageRef = ref(
        storage,
        `/product/${product.name}/${deletefileName}`
      );
      await deleteObject(storageRef);
      updateProduct(data);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot delete this photo.");
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
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.post(
          `${BACKENDURL}/admin/product/photo/`,
          {
            url,
            fileName: file.name,
            productId: product.id,
          },
          config
        );
        updateProduct(data);
      }
      setFileName([]);
      setFileValue([]);
    } catch (err) {
      setErrMsg("Oh. Somethings went wrong. Cannot upload this photo.");
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
          className="flex items-end justify-between border-2 w-full sm:w-2/5 m-1"
          key={photo.id}
        >
          <img
            className="w-32 m-3 cursor-pointer"
            src={photo.url}
            alt={photo.id.toString()}
            onClick={() => window.open(photo.url)}
          />
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
        <Typography sx={{ width: "30%" }}>stock: {product.stock}</Typography>
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
                  value={edit.type === "name" ? edit.input : product.name}
                  disabled={edit.type !== "name"}
                  onChange={(e) => setEdit({ ...edit, input: e.target.value })}
                />
                <button
                  className="btn btn-sm btn-square"
                  onClick={() => handleEdit("name")}
                >
                  {edit.type === "name" ? (
                    <DoneRoundedIcon />
                  ) : (
                    <EditRoundedIcon />
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <th>stock:</th>
              <td className="flex justify-between">
                <input
                  className="input input-sm w-3/4"
                  type="input"
                  value={edit.type === "stock" ? edit.input : product.stock}
                  disabled={edit.type !== "stock"}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setEdit({ ...edit, input: e.target.value });
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-square"
                  onClick={() => handleEdit("stock")}
                >
                  {edit.type === "stock" ? (
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
                  value={edit.type === "price" ? edit.input : product.price}
                  disabled={edit.type !== "price"}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setEdit({ ...edit, input: e.target.value });
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-square"
                  onClick={() => handleEdit("price")}
                >
                  {edit.type === "price" ? (
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
                  onChange={(e) =>
                    handleCheckBox("newProduct", e.target.checked)
                  }
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
                  onChange={(e) => handleCheckBox("onsale", e.target.checked)}
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
                      edit.type === "discount"
                        ? edit.input
                        : product.onsale.discount
                    }
                    disabled={edit.type !== "discount"}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        setEdit({ ...edit, input: e.target.value });
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm btn-square"
                    onClick={() => handleEdit("discount")}
                  >
                    {edit.type === "discount" ? (
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
          <div className="flex flex-wrap justify-around">{photoDisplay}</div>
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
            value={
              edit.type === "description" ? edit.input : product.description
            }
            disabled={edit.type !== "description"}
            onChange={(e) => setEdit({ ...edit, input: e.target.value })}
          />
          <button
            className="btn btn-sm mt-2 btn-neutral"
            onClick={() => handleEdit("description")}
          >
            {edit.type === "description" ? (
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
