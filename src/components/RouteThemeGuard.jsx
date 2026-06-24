import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyAppTheme, getStoredTheme } from "../lib/theme";

const publicRoutes = [
  "/landing",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

const isPublicRoute = (pathname) => {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
};

const RouteThemeGuard = () => {
  const location = useLocation();

  useEffect(() => {
    const publicPage = isPublicRoute(location.pathname);

    if (publicPage) {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("public-light-route");
      return;
    }

    document.body.classList.remove("public-light-route");
    applyAppTheme(getStoredTheme());
  }, [location.pathname]);

  return null;
};

export default RouteThemeGuard;
