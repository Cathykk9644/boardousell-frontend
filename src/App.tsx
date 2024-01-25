import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div data-theme="nord">
      <Navibar />
      <Outlet />
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <nav>
          <Link className="link link-hover" to="/aboutus">
            About us
          </Link>

          <Link className="link link-hover" to="/policy">
            Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
