import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useState } from "react";

export default function App() {
  const [userEmail, setUserEmail] = useState<string>("test@test.com");

  return (
    <div data-theme="nord">
      <Navibar />
      <Outlet context={userEmail} />
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
