import logo from "../img/boardousell-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Drawer, Slide } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKENDURL } from "../../constant";
import { useAuth0 } from "@auth0/auth0-react";
type props = {
  open: boolean;
  setDrawer: Function;
  setError: Function;
};

export default function Navibar({ open, setDrawer, setError }: props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const [keyword, setKeyword] = useState<string>("");
  const navi = useNavigate();

  const handleSearch = () => {
    setOpenSearch(false);
    setKeyword("");
    setSelectedCategory("");
    if (selectedCategory.length && keyword.length) {
      return navi(`../search?category=${selectedCategory}&keyword=${keyword}`);
    }
    if (selectedCategory.length) {
      return navi(`../search?category=${selectedCategory}`);
    }
    if (keyword.length) {
      return navi(`../search?keyword=${keyword}`);
    }
    return navi(`../search`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/category/all`);
        setCategories(data);
      } catch (error) {
        setError({
          backHome: false,
          message: "Oh. Sorry, cannot load categories for now.",
        });
      }
    };
    fetchData();
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, [setError]);

  const option = categories.map((category) => {
    return (
      <option value={category} key={category}>
        {category}
      </option>
    );
  });

  const searchAndMenu =
    windowWidth > 640 ? (
      <div className="space-x-1 pr-4 overflow-x-hidden flex-initial">
        <Slide direction="left" in={openSearch}>
          <div className="flex flex-row items-center space-x-1">
            <div className="flex flex-col space-y-1">
              <select
                value={selectedCategory}
                className="select select-sm select-bordered"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Category: </option>
                {option}
              </select>
              <input
                className="input input-sm input-bordered"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search:"
              />
            </div>
            <button className="btn btn-ghost" onClick={handleSearch}>
              <SearchRoundedIcon />
            </button>
          </div>
        </Slide>
        {openSearch ? (
          <button
            className="btn btn-ghost btn-square"
            onClick={() => setOpenSearch(false)}
          >
            <ChevronRightIcon />
          </button>
        ) : (
          <button
            className="btn btn-ghost btn-square"
            onClick={() => setOpenSearch(true)}
          >
            <SearchRoundedIcon />
          </button>
        )}

        <button className="btn btn-ghost" onClick={() => setDrawer("nav")}>
          <MenuIcon />
        </button>
      </div>
    ) : (
      <div className="flex-initial">
        <Slide
          direction="down"
          in={openSearch}
          className="flex items-center space-x-3 mr-3"
        >
          <div>
            <div className="flex flex-col space-y-1">
              <select
                value={selectedCategory}
                className="select select-sm select-bordered"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Category: </option>
                {option}
              </select>
              <input
                className="input input-sm input-bordered"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search:"
              />
            </div>
            <button
              className="btn btn-ghost btn-square btn-sm"
              onClick={handleSearch}
            >
              <SearchRoundedIcon />
            </button>
            <button
              className="btn btn-ghost btn-square btn-sm"
              onClick={() => setOpenSearch(false)}
            >
              <ExpandLessIcon />
            </button>
          </div>
        </Slide>
        <Slide
          direction="down"
          in={!openSearch}
          className="absolute right-5 flex space-x-3"
        >
          <div>
            <button
              className="btn btn-ghost btn-square btn-sm"
              onClick={() => setOpenSearch(true)}
            >
              <SearchRoundedIcon />
            </button>
            <button
              className="btn btn-ghost btn-square btn-sm"
              onClick={() => setDrawer("nav")}
            >
              <MenuIcon />
            </button>
          </div>
        </Slide>
      </div>
    );

  return (
    <div className="navbar shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost max-h-full h-20">
          <img className="max-h-full" src={logo} alt="logo" />
        </Link>
      </div>
      {searchAndMenu}
      <Drawer open={open} anchor="right" onClose={() => setDrawer(null)}>
        <div className="bg-neutral-content min-h-screen w-52">
          {isAuthenticated ? (
            <div className="h-20 flex justify-evenly items-center">
              <Link to="/orderlist" onClick={() => setDrawer(null)}>
                <Inventory2RoundedIcon />
              </Link>
              <Link to="/user" onClick={() => setDrawer(null)}>
                <AccountCircleRoundedIcon />
              </Link>
              <button onClick={() => logout()}>
                <LogoutRoundedIcon />
              </button>
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center">
              <button
                className="btn btn-secondary"
                onClick={() => loginWithRedirect()}
              >
                Login/Register
              </button>
            </div>
          )}
          <Divider className="bg-primary" />
          <ul className="menu flex flex-col items-center ">
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/notice"
                onClick={() => setDrawer(null)}
              >
                All Notices
              </Link>
            </li>
            <li>
              <Link
                className="place-content-center btn btn-ghost "
                to="/explore"
                onClick={() => setDrawer(null)}
              >
                Explore
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
}
