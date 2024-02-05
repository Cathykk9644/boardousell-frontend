import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import AdminProductPage from "./AdminProductPage";
import AdminOrderPage from "./AdminOrderPage";
import AdminUserPage from "./AdminUserPage";
import AdminInfoPage from "./AdminInfoPage";
import AdminNoticePage from "./AdminNoticePage";
import { useAuth0 } from "@auth0/auth0-react";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<string>("user");
  const { logout } = useAuth0();

  let currentTabDisplay;
  switch (currentTab) {
    case "user":
      currentTabDisplay = <AdminUserPage />;
      break;
    case "order":
      currentTabDisplay = <AdminOrderPage />;
      break;
    case "product":
      currentTabDisplay = <AdminProductPage />;
      break;
    case "infomation":
      currentTabDisplay = <AdminInfoPage />;
      break;
    case "notice":
      currentTabDisplay = <AdminNoticePage />;
      break;
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-evenly w-full m-5">
        <h1 className="text-2xl self-start">Admin Page:</h1>
        <button className="btn btn-outline" onClick={() => logout()}>
          Log out
        </button>
      </div>
      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
        <Tab label="Product" value="product" />
        <Tab label="Order" value="order" />
        <Tab label="Infomation" value="infomation" />
        <Tab label="Notice" value="notice" />
        <Tab label="User" value="user" />
      </Tabs>
      {currentTabDisplay}
    </div>
  );
}
