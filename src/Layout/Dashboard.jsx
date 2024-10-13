import { useState } from "react";
import { FaHome,  FaUser, FaUsers,  FaBars, FaTimes, FaBus, FaRoute } from "react-icons/fa";
import { GiBus, GiPoliceOfficerHead } from "react-icons/gi";
import { NavLink, Outlet } from "react-router-dom";
import { FaMoneyCheckAlt } from "react-icons/fa";


const Dashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { to: '/dashboard/adminHome', label: 'Admin Home', icon: FaHome },
        { to: '/dashboard/profile', label: 'Profile', icon: FaUser },
        { to: '/dashboard/payment', label: 'Payment', icon: FaMoneyCheckAlt },
        { to: '/dashboard/counterPayment', label: "Counter's Payment", icon: FaMoneyCheckAlt },
        { to: '/dashboard/addBus', label: 'Add A Bus', icon: FaBus  },
        { to: '/dashboard/manageBus', label: 'Manage Bus', icon: GiBus },
        { to: '/dashboard/addRoute', label: 'Add Route', icon: FaRoute },
        { to: '/dashboard/routeManage', label: 'Route Management', icon: FaRoute },
        { to: '/dashboard/allUsers', label: 'All Users Management', icon: FaUsers },
        { to: '/dashboard/allMaster', label: 'All Master Management', icon: GiPoliceOfficerHead },
        { to: '/', label: 'Home', icon: FaHome },
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className={`w-72 min-h-screen bg-[#E675291A] p-4 sm:block ${isMenuOpen ? 'block absolute top-0 left-0' : 'hidden'} sm:relative`}>
                <ul className="menu space-y-4 mt-10">
                    {navItems.map((item, index) => (
                        <li key={index} className="p-1 uppercase">
                            <NavLink 
                                to={item.to}
                                className={({ isActive }) => `flex items-center space-x-2 p-2 ${isActive ? ' text-white bg-primary p-2 rounded' : 'text-[#2b2b38]'}`}>
                                <item.icon className="text-xl" />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                    <div className="divider"></div>
                </ul>
            </div>

            {/* Hamburger Icon for small devices */}
            <div className="sm:hidden fixed top-0 left-0 w-full bg-[#954917e0] p-4 flex justify-between items-center">
                <h1 className="text-white text-lg">Admin Dashboard</h1>
                <button onClick={toggleMenu} className="text-white">
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            <div className="flex-1 mt-16 sm:mt-0">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
