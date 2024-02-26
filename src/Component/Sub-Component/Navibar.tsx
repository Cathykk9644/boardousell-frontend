import logo from "../img/boardousell-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Link, useNavigate } from "react-router-dom";
import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
type props = {
  open: boolean;
  setDrawer: Function;
};

export default function Navibar({ open, setDrawer }: props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const [keyword, setKeyword] = useState<string>("");
  const navi = useNavigate();
  const handleSearch = () => {
    setKeyword("");
    if (!keyword.length) {
      return navi(`../search`);
    }
    navi(`../search?keyword=${keyword}&page=1`);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  const mobileDisplay = (
    <div className="navbar flex justify-between">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost px-2 h-20">
          <img className="max-h-full" src={logo} alt="logo" />
        </Link>
        <button
          className="btn btn-ghost btn-square btn-sm"
          onClick={() => setDrawer("nav")}
        >
          <MenuIcon />
        </button>
      </div>
      <div className="navbar-end space-x-2">
        <SearchRoundedIcon
          className="cursor-pointer m-"
          onClick={() => navi(`/search`)}
        />
        {isAuthenticated && (
          <Link
            to="/orderlist"
            className="btn btn-circle btn-primary"
            onClick={() => setDrawer(null)}
          >
            <Inventory2RoundedIcon />
          </Link>
        )}
        {isAuthenticated && (
          <Link
            to="/user"
            className="btn btn-circle btn-secondary"
            onClick={() => setDrawer(null)}
          >
            <AccountCircleRoundedIcon />
          </Link>
        )}
        {isAuthenticated && (
          <button
            className="btn btn-accent btn-circle"
            onClick={() => logout()}
          >
            <LogoutRoundedIcon />
          </button>
        )}

        {!isAuthenticated && (
          <button
            className="btn btn-accent rounded-full"
            onClick={() => loginWithRedirect()}
          >
            Login/Register
          </button>
        )}
      </div>

      <Drawer open={open} anchor="left" onClose={() => setDrawer(null)}>
        <div className="bg-neutral-content min-h-screen w-52">
          <ul className="menu flex flex-col items-center space-y-5 mt-5">
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/notice"
                onClick={() => setDrawer(null)}
              >
                Announcement
              </Link>
            </li>
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/explore"
                onClick={() => setDrawer(null)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/contactus"
                onClick={() => setDrawer(null)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </Drawer>
    </div>
  );

  const largeDisplay = (
    <div className="navbar">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost max-h-full h-20">
          <img className="max-h-full" src={logo} alt="logo" />
        </Link>
      </div>
      <div className="navbar-center flex gap-10">
        <button className="btn btn-ghost" onClick={() => navi("/notice")}>
          Announcement
        </button>
        <button className="btn btn-ghost" onClick={() => navi("/explore")}>
          Products
        </button>
        <button className="btn btn-ghost" onClick={() => navi("/contactus")}>
          Contact Us
        </button>
      </div>
      <div className="navbar-end gap-5 mr-5">
        <label className="input input-bordered flex items-center rounded-full gap-2">
          <SearchRoundedIcon
            className="cursor-pointer"
            onClick={handleSearch}
          />
          <input
            type="text"
            className="grow"
            placeholder="E.g. Marvel Champion"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
        {isAuthenticated ? (
          <div className="space-x-5 flex items-center">
            <Link
              to="/orderlist"
              className="btn btn-circle btn-primary"
              onClick={() => setDrawer(null)}
            >
              <Inventory2RoundedIcon />
            </Link>
            <Link
              to="/user"
              className="btn btn-circle btn-secondary"
              onClick={() => setDrawer(null)}
            >
              <AccountCircleRoundedIcon />
            </Link>
            <button
              className="btn btn-accent btn-circle"
              onClick={() => logout()}
            >
              <LogoutRoundedIcon />
            </button>
          </div>
        ) : (
          <button
            className="btn btn-accent rounded-full"
            onClick={() => loginWithRedirect()}
          >
            Login/Register
          </button>
        )}
      </div>
    </div>
  );

  const searchAndMenu = windowWidth > 1024 ? largeDisplay : mobileDisplay;

  return searchAndMenu;
}
