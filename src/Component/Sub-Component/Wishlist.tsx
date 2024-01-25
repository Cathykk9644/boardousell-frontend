import StarsIcon from "@mui/icons-material/Stars";
import { useEffect, useState } from "react";
type props = {
  userEmail: string;
};

export default function Wishlist(props: props) {
  return (
    <div>
      <button className="btn btn-accent border-neutral ring-1 rounded-3xl fixed bottom-20 right-5">
        <StarsIcon />
      </button>
    </div>
  );
}
