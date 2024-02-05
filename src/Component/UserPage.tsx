import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
type outletProps = {
  userId: number;
  handleAddWishItem: Function;
  handleAddCart: Function;
  handleDeleteCart: Function;
  setError: Function;
};
export default function UserPage() {
  const { userId } = useOutletContext<outletProps>();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <div>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log out
      </button>
    </div>
  );
}
