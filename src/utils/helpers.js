export default function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("notifications");
  localStorage.removeItem("libraryLatest");

  sessionStorage.clear();

  window.location.href = "/auth/login";
}

