import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getCurrentUser } from "../../services/auth.service.js";

function CollectorRoute() {
  const location = useLocation();

  const [authStatus, setAuthStatus] = useState("checking");
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setAuthStatus("checking");

    getCurrentUser()
      .then((response) => {
        const user = response?.data?.user ?? response?.user;

        if (!isMounted) return;

        if (user?.role !== "staff") {
          setAuthStatus("unauthorized");
          return;
        }

        setMustChangePassword(user.mustChangePassword === true);
        setAuthStatus("authenticated");
      })
      .catch(() => {
        if (isMounted) {
          setAuthStatus("unauthenticated");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (authStatus === "checking") {
    return <p>Checking collector session...</p>;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/collector/login" replace />;
  }

  if (authStatus === "unauthorized") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const isChangePasswordPage =
    location.pathname === "/collector/change-password";

  if (mustChangePassword && !isChangePasswordPage) {
    return <Navigate to="/collector/change-password" replace />;
  }

  if (!mustChangePassword && isChangePasswordPage) {
    return <Navigate to="/collector/dashboard" replace />;
  }

  return <Outlet />;
}

export default CollectorRoute;
