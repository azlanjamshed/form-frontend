import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import StageTwoPage from "./pages/StageTwoPage.jsx";

import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
