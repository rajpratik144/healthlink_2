import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

import { Sun, Moon } from "lucide-react";

function Navbar() {

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // better UX than home
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          HealthLink
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition dark:text-amber-50"
          >
            {theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* ALWAYS VISIBLE */}
          <Link
            to="/find-doctors"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
          >
            Find Doctors
          </Link>

          {/* ================= NOT LOGGED IN ================= */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {/* ================= LOGGED IN ================= */}
          {user && (
            <>
              {/* ROLE BASED LINKS */}

              {user.role === "patient" && (
                <Link
                  to="/patient/dashboard"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
              )}

              {user.role === "doctor" && (
                <Link
                  to="/doctor/dashboard"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                >
                  Doctor Panel
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin/doctors"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                >
                  Admin Panel
                </Link>
              )}

              {/* USER NAME */}
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {user.name}
              </span>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;