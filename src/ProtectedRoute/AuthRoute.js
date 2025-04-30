import { Outlet, Navigate } from "react-router-dom";
import { getToken } from "services/LocalStorage";


// const AuthRoute = ({isRestricted}) => {

//     const token = getToken();
//     return token? <Outlet />: <Navigate to='/login' />
// }

const AuthRoute = ({ isRestricted }) => {
    const token = getToken();
  
    if (isRestricted && token) {
      // If the route is restricted and the user is logged in, redirect to the home page or any other route.
      return <Navigate to="/" />;
    }
  
    if (!isRestricted && !token) {
      // If the route is protected and the user is not logged in, redirect to the login page.
      return <Navigate to="/login" />;
    }
  
    // Otherwise, render the route's component.
    return <Outlet />;
  };

export default AuthRoute;