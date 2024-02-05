import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<string>("user");

  let currentTabDisplay;
  switch (currentTab) {
    case "user":
      currentTabDisplay = <div>user</div>;
      break;
    case "order":
      currentTabDisplay = <div>order</div>;
      break;
    case "product":
      currentTabDisplay = <div>product</div>;
      break;
    case "infomation":
      currentTabDisplay = <div>infomation</div>;
      break;
  }
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl self-start">Admin Page:</h1>
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
