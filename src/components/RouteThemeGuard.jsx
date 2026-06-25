import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    // Never allow global html.dark.
    // Public pages stay light. Internal app pages get dark only through PageShell.
    document.documentElement.classList.remove("dark");

    if (isPublicRoute(location.pathname)) {
      document.body.classList.add("public-light-route");
    } else {
      document.body.classList.remove("public-light-route");
    }
  }, [location.pathname]);

  return null;
};

export default RouteThemeGuard;
