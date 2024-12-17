import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Toggler from "./components/Toggler.jsx";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login, Signup } from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signature from "./components/Signature.jsx";

const AuthRoute = () => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? <Outlet /> : <Navigate to="/home" />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />}>
              <Route path="/home" element={<Home />} />
            </Route>
          </Route>
          <Route path="/signature/:signature" element={<Signature />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toggler />
    </AuthProvider>
  </StrictMode>
);
