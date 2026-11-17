import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getCurrentAdmin } from "../../services/auth.service.js";

function AdminRoute() {
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    getCurrentAdmin()
      .then((response) => {
        const user = response?.data?.user ?? response?.user;

        if (isMounted) {
          setAuthStatus(
            user?.role === "admin" ? "authenticated" : "unauthorized",
          );
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthStatus("unauthenticated");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (authStatus === "checking") {
    return (
      <div className="vf-landing-page">
        <main className="vf-landing-main">
          <section className="vf-landing-card">
            <p>Checking admin session...</p>
          </section>
        </main>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (authStatus === "unauthorized") {
    return <Navigate to="/collector/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
