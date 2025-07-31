import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const user = localStorage.getItem("user");

  // If user is logged in, show the content
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && typeof parsedUser === 'object') {
        return <Outlet />;
      }
    } catch (error) {
      console.error('Error parsing user:', error);
      // If user token is invalid, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  // If user is not logged in, redirect to login with return URL
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
