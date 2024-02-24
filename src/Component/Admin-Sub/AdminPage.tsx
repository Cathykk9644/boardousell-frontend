import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import AdminProductPage from "./AdminProductPage";
import AdminOrderPage from "./AdminOrderPage";
import AdminUserPage from "./AdminUserPage";
import AdminInfoPage from "./AdminInfoPage";
import AdminNoticePage from "./AdminNoticePage";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../img/boardousell-logo.png";
import AdminMembershipPage from "./AdminMembershipPage";
import AdminCategoryPage from "./AdminCategoryPage";
import { useNavigate } from "react-router-dom";
import { BACKENDURL } from "../../constant";
import axios from "axios";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<string>("order");
  const { logout, user, getAccessTokenSilently, isAuthenticated, isLoading } =
    useAuth0();
  const navi = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.get(
          `${BACKENDURL}/customer/user/${user?.sub}`,
          config
        );
        if (!data[0].isAdmin) {
          navi("/");
        }
      } catch (err) {
        navi("/");
      }
    };
    if (!isLoading && isAuthenticated) {
      checkAdmin();
    }
    if (isLoading && !isAuthenticated) {
      navi("/");
    }
  }, [getAccessTokenSilently, navi, user, isLoading, isAuthenticated]);

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
    <div className="h-screen">
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
