import { Navigate } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
  const getTokenFromSession = localStorage.getItem("userToken");
  return getTokenFromSession ? children : <Navigate to="/dang-nhap" replace={true} />;
};
