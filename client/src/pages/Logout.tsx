import { Navigate } from "react-router-dom";
import { get } from "../api/api";
import { logout } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { clearUserData } from "../utils/localStorage";

const Logout: React.FC = () => {
  const dispatch = useDispatch();

  (async () => {
    await get("auth/logout");
    clearUserData();
  })();

  dispatch(logout());

  return <Navigate to="/" />;
};

export default Logout;
