import Navibar from "./Component/Shared-component/Navibar";
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
