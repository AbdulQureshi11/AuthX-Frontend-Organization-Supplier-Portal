import React, { useState } from "react";
import Search from "./Search";
import Suppliers from "./Suppliers";
import { userMenu } from "../../../Utlis/Dashboard";


const SubDashboardComponent = () => {
  const [selected, setSelected] = useState("Suppliers");

  const content = {
    Suppliers: <Suppliers />,
    Search: <Search />,
  };

  return (
    <div className="h-screen flex bg-[#f9fbfd] font-sans">
      
      <div className="w-[20%] bg-gradient-to-b from-[#2563eb] to-[#3b82f6] text-white flex flex-col shadow-md">
        <div className="px-6 py-6 border-b border-blue-400/40">
          <h1 className="text-2xl font-semibold tracking-wide text-blue-50">
            User Panel
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto mt-4">
          {userMenu?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item?.name)}
              className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-lg mx-3 mb-2 transition-all duration-200 ${
                selected === item?.name
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-blue-100 hover:bg-blue-200/30 hover:text-white"
              }`}
            >
              <span className="text-lg">{item?.icon}</span>
              <span className="text-md font-medium">{item?.name}</span>
            </div>
          ))}
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
