import logo from "../img/boardousell-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Link } from "react-router-dom";
import { Divider, Drawer } from "@mui/material";
type props = {
  open: boolean;
  setDrawer: Function;
};

export default function Navibar({ open, setDrawer }: props) {
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
        <div className="btn btn-ghost" onClick={() => setDrawer("nav")}>
          <MenuIcon />
        </div>
      </div>
      <Drawer open={open} anchor="right" onClose={() => setDrawer(null)}>
        <div className="bg-neutral-content min-h-screen w-52">
          <div className="h-20 flex justify-evenly items-center">
            <Link to="/orderlist" onClick={() => setDrawer(null)}>
              <Inventory2RoundedIcon />
            </Link>
            <Link to="/user" onClick={() => setDrawer(null)}>
              <AccountCircleRoundedIcon />
            </Link>
          </div>
          <Divider className="bg-primary" />
          <ul className="menu flex flex-col items-center ">
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/explore"
                onClick={() => setDrawer(null)}
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
