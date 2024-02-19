import { useState } from "react";
import { message, order } from "../../../type";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";
import { BACKENDURL } from "../../../constant";
import axios from "axios";

type props = {
  order: order;
  open: boolean;
  setExpand: Function;
  setOrders: Function;
  setErrMsg: Function;
};

type editStatus = {
  editing: boolean;
  option: order["status"];
};

export default function OrderEditForm({
  order,
  open,
  setExpand,
  setOrders,
  setErrMsg,
}: props): JSX.Element {
  const [editStatus, setEditStatus] = useState<editStatus>({
    editing: false,
    option: "Pending",
  });
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${BACKENDURL}/message`, {
        orderId: Number(order.id),
        isUserReceiver: true,
        detail: input,
      });
      setOrders((prev: order[]) => {
        const newOrders = [...prev];
        const targetIndex = prev.findIndex((target) => target.id === order.id);
        newOrders[targetIndex].messages.unshift(data);
        return newOrders;
      });
      setInput("");
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Oh. Sorry, cannot send message for now.");
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (order.status === "Cancelled") {
      return setErrMsg("Cannot change cancelled order.");
    }
    if (editStatus.editing) {
      handleConfirmEdit();
    }
    setEditStatus({ editing: !editStatus.editing, option: order.status });
  };

  const handleConfirmEdit = async () => {
    if (editStatus.option === order.status) {
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.put(`${BACKENDURL}/order/status`, {
        status: editStatus.option,
        orderId: order.id,
      });
      setOrders((prev: order[]) => {
        const newOrders = [...prev];
        const targetIndex = prev.findIndex((target) => target.id === order.id);
        newOrders[targetIndex] = data;
        return newOrders;
      });
      setErrMsg("");
      setIsLoading(false);
    } catch (error) {
      setErrMsg("Oh. Sorry, cannot send message for now.");
      setIsLoading(false);
    }
  };

  const productDisplay = order.products.map((product) => {
    return (
      <div key={product.id} className="flex justify-between">
        <div>{product.name}</div>
        <div>x{product.productorder.amount}</div>
      </div>
    );
  });

  order.messages.sort((a: message, b: message) => {
    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });
  const messageDisplay = order.messages.map((message) => {
    return (
      <div
        className={`chat ${message.isUserReceiver ? "chat-end" : "chat-start"}`}
        key={message.id}
      >
        <div
          className={`chat-bubble ${
            message.isUserReceiver
              ? "chat-bubble-success"
              : "chat-bubble-accent"
          }`}
        >
          {message.detail}
        </div>
      </div>
    );
  });

  return (
    <Accordion
      expanded={open}
      onChange={() => setExpand(open ? null : order.id)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ width: "50%" }}>Order No: {order.id}</Typography>
        <Typography sx={{ width: "50%" }}>Status: {order.status}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Backdrop open={isLoading} sx={{ zIndex: 99 }}>
          <CircularProgress />
        </Backdrop>
        <table className="table">
          <tbody>
            <tr>
              <th>Address:</th>
              <td>{order.address}</td>
            </tr>
            <tr>
              <th>Amount:</th>
              <td>{order.amount}</td>
            </tr>
            <tr>
              <th>Status:</th>
              <td>
                <div className="flex justify-between items-center">
                  <div>
                    {editStatus.editing ? (
                      <select
                        value={editStatus.option}
                        className="select select-sm select-bordered"
                        onChange={(e) =>
                          setEditStatus({
                            ...editStatus,
                            option: e.target.value as editStatus["option"],
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Ready">Ready</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      order.status
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-square"
                    onClick={handleEdit}
                  >
                    {editStatus.editing ? (
                      <DoneRoundedIcon />
                    ) : (
                      <EditRoundedIcon />
                    )}
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>User email:</th>
              <td>{order.user.email}</td>
            </tr>
            <tr>
              <th>User name:</th>
              <td>{order.user.name}</td>
            </tr>
            <tr>
              <th>User phone:</th>
              <td>{order.user.phone}</td>
            </tr>
            <tr>
              <th>Products:</th>
              <td>
                <div className="flex flex-col">{productDisplay}</div>
              </td>
            </tr>
          </tbody>
        </table>
        {<div className="divider">Message:</div>}
        <div
          className={`py-1 mx-3 my-2 bg-base-200 border-info ${
            !!order.messages.length && "border"
          }`}
        >
          {!!order.messages.length && messageDisplay}
          <div className="w-full flex flex-row items-center">
            <input
              className="m-1 input input-md w-full"
              type="input"
              placeholder="Type in message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="m-1 btn btn-md btn-primary btn-square"
              onClick={handleSendMessage}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
