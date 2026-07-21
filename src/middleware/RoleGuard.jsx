import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import instance from "../api/config";
import AccessDeniedPage from "../pages/public/AccessDenied";

export function RoleGuard({ allowedRoles, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    instance
      .post("/auth/checkToken", { token: token })
      .then((response) => {
        if (response.data.role) {
          setUser(response.data);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error checking token:", error);
        console.error("Error response:", error.response?.data);
        setUser(null);
        setLoading(false);
        navigate("/auth/login");
      });
  }, [location.pathname, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (allowedRoles.includes(user?.role)) {
    return children;
  } else {
    return (
      <AccessDeniedPage
        autoRedirectToLogin
        redirectDelaySeconds={30}
        alertMessage="Sorry, you have to be logged in."
      />
    );
  }
}
