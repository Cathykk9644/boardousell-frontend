import Navibar from "./Component/Sub-Component/Navibar";
import { Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div data-theme="nord">
      <Navibar />
      <Outlet />
    </div>
  );
}
