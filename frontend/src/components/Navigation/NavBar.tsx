import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const navItems = [
    { path: "/", icon: "", text: "Home" },
    { path: "/all-posts", icon: "", text: "Browse" },
    { path: "/goals", icon: "", text: "Goals" },
    { path: "/my-posts", icon: "", text: "My Posts" },
    { path: "/learning", icon: "", text: "Learning Plans" },
    { path: "/notifications", icon: "", text: "Notifications" },
    { path: "/note", icon: "", text: "Note" },
    { path: "/buybook", icon: "", text: "Buy" },

    ...(isLoggedIn
      ? [{ path: "/profile", icon: "👤", text: "Profile" }]
      : [{ path: "/login", icon: "🔑", text: "Login" }]),
  ];

  return (
    <motion.nav
      className="bg-white shadow-md fixed top-0 w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link
          to="/"
          className="text-2xl font-bold flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
        >
          <span className="text-3xl">💡</span>
          <span>SkillZen</span>
        </Link>

        <ul className="flex space-x-4">
          {navItems.map(({ path, icon, text }) => {
            const isActive = location.pathname === path;

            return (
              <motion.li
                key={path}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-200 font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{text}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
