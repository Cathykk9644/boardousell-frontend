import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import AdminProductPage from "./AdminProductPage";
import AdminOrderPage from "./AdminOrderPage";
import AdminUserPage from "./AdminUserPage";
import AdminInfoPage from "./AdminInfoPage";
import AdminNoticePage from "./AdminNoticePage";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../img/boardousell-logo.png";
import AdminMembershipPage from "./AdminMembershipPage";
import AdminCategoryPage from "./AdminCategoryPage";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<string>("order");
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
    case "membership":
      currentTabDisplay = <AdminMembershipPage />;
      break;
    case "category":
      currentTabDisplay = <AdminCategoryPage />;
      break;
  }
  return (
    <div className="min-h-screen max-h-screen">
      <div className="flex justify-between items-center">
        <img className="h-20" src={logo} alt="logo" />
        <h1 className="text-2xl">Admin Page</h1>
        <button className="btn btn-outline" onClick={() => logout()}>
          Log out
        </button>
      </div>
      <div className="border-b-2 border-accent p-1">
        <Tabs
          variant="scrollable"
          allowScrollButtonsMobile
          scrollButtons="auto"
          value={currentTab}
          onChange={(e, val) => setCurrentTab(val)}
        >
          <Tab label="Order" value="order" />
          <Tab label="Product" value="product" />
          <Tab label="Category" value="category" />
          <Tab label="Infomation" value="infomation" />
          <Tab label="Notice" value="notice" />
          <Tab label="User" value="user" />
          <Tab label="Membership" value="membership" />
        </Tabs>
      </div>
      <div className="p-2">{currentTabDisplay}</div>
    </div>
  );
}
