import { adminMenu } from "../../../Utlis/Dashboard";
import Organization from "./Organization";
import React, { useState } from "react";
import Suppliers from "./Suppliers";
import Configs from "./Configs";
import Search from "./Search";
import Users from "./Users";
import Logs from "./Logs";

// Redux
import { useDispatch } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const MainDashboardComponent = () => {
  const [selected, setSelected] = useState("Organization");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());      
    navigate("/");            
  };

  const content = {
    Organization: <Organization />,
    Users: <Users />,
    Suppliers: <Suppliers />,
    Configs: <Configs />,
    Logs: <Logs />,
    Search: <Search />,
  };

  return (
    <div className="h-screen flex bg-[#f5f7fa] font-sans">
      {/* Sidebar */}
      <div className="w-[18%] bg-gradient-to-b from-[#0a192f] to-[#112240] text-white flex flex-col shadow-lg">
        <div className="px-6 py-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-semibold tracking-wide text-blue-200">
            Admin Panel
          </h1>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto mt-4">
          {adminMenu?.map((item, key) => (
            <div
              key={key}
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
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md font-semibold transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f5f7fa] p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-300">
          {content[selected]}
        </div>
      </div>
    </div>
  );
};

export default MainDashboardComponent;