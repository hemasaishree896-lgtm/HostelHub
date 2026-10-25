import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );


  // Check login

  if (isLoggedIn !== "true" || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // Check role

  if (role && user.role !== role) {

    if (user.role === "warden") {

      return (
        <Navigate
          to="/warden-dashboard"
          replace
        />
      );

    }


    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  return children;

}

export default ProtectedRoute;