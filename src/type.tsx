export type category = {
  id: number;
  name: string;
};
export type product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  onsale?: { id: number; discount: number };
  newproduct?: { id: number };
  categories: category[];
  productPhotos: {
    id: number;
    url: string;
    thumbnail: boolean;
    fileName: string;
  }[];
  productorder: {
    amount: number;
  };
};

export type item = {
  id: number;
  product: product;
};

export type level = {
  id: number;
  title: string;
  requirement: number;
  discount: number;
};

export type message = {
  id: number;
  isUserReceiver: boolean;
  detail: string;
  createdAt: string;
  updatedAt: string;
};

export type user = {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  points: number;
  phone: number;
  level: level;
};

export type order = {
  id: number;
  userId: number;
  address: string;
  amount: number;
  status: "Pending" | "Paid" | "Ready" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    name: string;
    phone: number;
  };
  products: { id: number; name: string; productorder: { amount: number } }[];
  messages: message[];
};

export type notice = {
  id: number;
  title: string;
  url?: string;
  detail: string;
  createdAt: string;
};

export type infomation = {
  id: number;
  name: "Link" | "Map" | "Email" | "Phone";
  detail: string;
};

export type outletProps = {
  userId: number;
  handleAddItem: Function;
  handleDeleteItem: Function;
  setCart: Function;
  setError: Function;
};
