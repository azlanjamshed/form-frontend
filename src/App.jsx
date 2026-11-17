import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import StageTwoPage from "./pages/StageTwoPage.jsx";

import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";

import CollectorLoginPage from "./pages/collector/CollectorLoginPage.jsx";
import CollectorDashboardPage from "./pages/collector/CollectorDashboardPage.jsx";
import CollectorRoute from "./components/collector/CollectorRoute.jsx";

import CollectorChangePasswordPage from "./pages/collector/CollectorChangePasswordPage.jsx";

import PublicSubmissionPage from "./pages/PublicSubmissionPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public form */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/stage-2" element={<StageTwoPage />} />

        {/* Public shared submission */}
        <Route path="/user/:publicShareId" element={<PublicSubmissionPage />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* Collector login */}
        <Route path="/collector/login" element={<CollectorLoginPage />} />

        {/* Protected collector routes */}
        {/* Protected collector routes */}
        <Route element={<CollectorRoute />}>
          <Route
            path="/collector/dashboard"
            element={<CollectorDashboardPage />}
          />
          <Route
            path="/collector/change-password"
            element={<CollectorChangePasswordPage />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
