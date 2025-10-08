import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCredentials } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import Search from "./Search";
import Suppliers from "./Suppliers";
import { userMenu } from "../../../Utlis/Dashboard";

const SubDashboardComponent = () => {
  const [selected, setSelected] = useState("Suppliers");
  const [loading, setLoading] = useState(true); // ⏳ handle refresh flicker
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState(user);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!user && storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      dispatch(setCredentials({ user: parsedUser, token: storedToken }));
    } else if (user) {
      setCurrentUser(user);
    }

    // small delay to smooth out loading
    setTimeout(() => setLoading(false), 300);
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // go back to login page
  };

  const content = {
    Suppliers: <Suppliers />,
    Search: <Search />,
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f9fbfd]">
        <div className="text-gray-600 text-lg font-medium animate-pulse">
          Loading dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#f9fbfd] font-sans">
      {/* Sidebar */}
      <div className="w-[20%] bg-gradient-to-b from-[#0a192f] to-[#112240] text-white flex flex-col shadow-md">
        {/* User Info */}
        <div className="px-6 py-6 border-b border-gray-700/50 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-wide text-blue-200">
            User Panel
          </h1>
          {currentUser && (
            <p className="text-sm text-gray-300">
              Welcome,{" "}
              <span className="font-semibold text-white">
                {currentUser?.name ||
                  currentUser?.username ||
                  currentUser?.email ||
                  "User"}
              </span>
            </p>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto mt-4">
          {userMenu?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item?.name)}
              className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-lg mx-3 mb-2 transition-all duration-200 ${
                selected === item?.name
                  ? "bg-blue-100 text-blue-900 shadow-sm"
                  : "text-gray-300 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <span className="text-lg">{item?.icon}</span>
              <span className="text-md font-medium">{item?.name}</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow-md transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f9fbfd] p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-300">
          {content[selected]}
        </div>
      </div>
    </div>
  );
};

export default SubDashboardComponent;
