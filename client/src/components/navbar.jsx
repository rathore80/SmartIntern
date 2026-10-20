import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const handleLogout = ()=> {
    logout();
    navigate("/login");
  }
;
  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        SmartIntern
      </Link>

      <div className="navbar-links">

        <Link to="/" className="nav-link">
          Home
        </Link>

        {user?.role === "student" && (
          <>
            <Link to="/student/dashboard" className="nav-link">
              Dashboard
            </Link>

            <Link to="/student/jobs" className="nav-link">
              Jobs
            </Link>

            <Link
              to="/student/recommendations"
              className="nav-link"
            >
              Recommendations
            </Link>

            <Link
              to="/student/applications"
              className="nav-link"
            >
              Applications
            </Link>

            <Link to="/student/profile" className="nav-link">
              Profile
            </Link>
          </>
        )}

        {user?.role === "recruiter" && (
            <>
               <Link to="/recruiter/profile" className="nav-link">
                  Profile
                </Link> 
                <Link
                to="/recruiter/dashboard"
                className="nav-link"
                >
                Dashboard
                </Link>

                <Link
                to="/recruiter/jobs"
                className="nav-link"
                >
                Jobs
                </Link>

                <Link
                to="/recruiter/applications"
                className="nav-link"
                >
                Applications
                </Link>
            </>
            )}

            {user?.role === "admin" && (
  <>
    <Link
      to="/admin/dashboard"
      className="nav-link"
    >
      Dashboard
    </Link>

    <Link
      to="/admin/users"
      className="nav-link"
    >
      Users
    </Link>

    <Link
      to="/admin/jobs"
      className="nav-link"
    >
      Jobs
    </Link>
  </>
)}
        {user ? (
          <>
          
<Link
  to="/notifications"
  className="nav-link notification-nav-link"
  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
  title="Notifications"
>
  <span className="notification-bell">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>

    {unreadCount > 0 && (
      <span className="notification-badge">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </span>
  <span>Notifications</span>
</Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;