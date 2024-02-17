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

export type order = {
  id: number;
  userId: number;
  address: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  level: {
    discount: number;
    title: string;
    requirement: number;
  };
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
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
  setError: Function;
};
