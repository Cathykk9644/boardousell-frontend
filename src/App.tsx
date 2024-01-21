import "./App.css";
import Navibar from "./Component/Shared-component/Navibar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="App" data-theme="nord">
      <Navibar />
      <Outlet />
    </div>
  );
}
