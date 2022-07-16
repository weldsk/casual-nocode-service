import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./use-auth";

interface Props {
  logined: boolean,
  redirectPath: string
}
const RedirectRoute = (props: Props) => {
  const {logined, redirectPath } = props;
  const {isAuthenticated} = useAuth();
  if (isAuthenticated!==logined) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}

export default RedirectRoute;
