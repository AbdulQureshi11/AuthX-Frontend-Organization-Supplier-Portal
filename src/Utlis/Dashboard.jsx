import { GoOrganization } from "react-icons/go";
import { FaUser } from "react-icons/fa6";
import { AiFillApi } from "react-icons/ai";
import { IoIosSettings } from "react-icons/io";
import { FaList } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export const adminMenu = [
    { id: 1, name: "Organization", icon: <GoOrganization /> },
    { id: 2, name: "Users", icon: <FaUser /> },
    { id: 3, name: "Suppliers", icon: <AiFillApi /> },
    { id: 4, name: "Configs", icon: <IoIosSettings /> },
    { id: 5, name: "Logs", icon: <FaList /> },
    { id: 6, name: "Search", icon: <IoSearch /> },
];

// Sub User Dashboard
export const userMenu = [
    { id: 1, name: "Suppliers", icon: <AiFillApi /> },
    { id: 2, name: "Search", icon: <IoSearch /> },
];
