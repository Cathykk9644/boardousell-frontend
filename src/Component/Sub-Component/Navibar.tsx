import logo from "../img/boardousell-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Link } from "react-router-dom";
import { Divider, Drawer } from "@mui/material";
import { useState } from "react";

export default function Navibar() {
  const [openDrawer, setDrawer] = useState<boolean>(false);
  return (
    <div className="navbar shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost max-h-full h-20">
          <img className="max-h-full" src={logo} alt="logo" />
        </Link>
      </div>
      <div className="space-x-4 pr-4">
        <div className="btn btn-ghost">
          <SearchRoundedIcon />
        </div>
        <div className="btn btn-ghost" onClick={() => setDrawer(true)}>
          <MenuIcon />
        </div>
      </div>
      <Drawer open={openDrawer} anchor="right" onClose={() => setDrawer(false)}>
        <div className="bg-neutral-content min-h-screen w-52">
          <div className="h-20 flex justify-evenly items-center">
            <Link to="/orderlist" onClick={() => setDrawer(false)}>
              <Inventory2RoundedIcon />
            </Link>
            <Link to="/user" onClick={() => setDrawer(false)}>
              <AccountCircleRoundedIcon />
            </Link>
          </div>
          <Divider className="bg-primary" />
          <ul className="menu flex flex-col items-center ">
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/explore"
                onClick={() => setDrawer(false)}
              >
                Explore
              </Link>
            </li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
}
