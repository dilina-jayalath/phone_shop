import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Route, useNavigate } from "react-router-dom";
import { logo, logoLight } from "../../assets/images";
import { BiBookAdd, BiBookmark, BiPhone, BiPackage, BiChart } from "react-icons/bi";
import { GiAutoRepair } from "react-icons/gi";


// Import the separated AppRoutes component
// import AppRoutes from "./AppRoutes";

const Content = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selected, setSelected] = useState("/dashboard");
  const navigate = useNavigate();

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMenuClick = (link) => {
    setSelected(link);
    navigate(link);
  };

  const sections = [
    {
      title: "REPAIRS",
      link: "/admin/repairs",
      icon: GiAutoRepair,
      whiteIcon: "icons.whitehome",
    },
    {
      title: "PRODUCTS",
      link: "/admin/products",
      icon: BiBookAdd,
      whiteIcon: "icons.whiteharvest",
    },
    {
      title: "STOCK",
      link: "/admin/stock",
      icon: BiPackage,
      whiteIcon: "icons.whitestock",
    },
    {
      title: "ORDERS",
      link: "/admin/orders",
      icon: BiBookmark,
      whiteIcon: "icons.whitefinance",
    },
    {
      title: "REPORTS",
      link: "/admin/reports",
      icon: BiChart,
      whiteIcon: "icons.whitereports",
    }
  ];

  const renderMenu = sections.map((section, index) => (
    <div
      key={index}
      onClick={() => handleMenuClick(section.link)}
      className="cursor-pointer" // Use cursor-pointer for clickable items
    >
      <MenuItem
        className={`flex items-center min-h-16 p-2 mt-2 ${
          collapsed
            ? ""
            : "hover:bg-[#a82929] hover:bg-opacity-30 hover:rounded-l-full"
        } ${selected === section.link ? "bg-[#4171a1b3] rounded-l-full" : ""}`}
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center" : ""}`}
        >
          {/* <img
            src={`${
              selected === section.link ? section.whiteIcon : section.icon
            }`}
            className={`w-8 h-auto ${
              selected === section.link ? "opacity-100" : "opacity-50"
            }`}
            alt={section.title}
          /> */}
          <section.icon className="w-5 h-auto"/>
          <p
            className={`ml-6 font-medium ${collapsed ? "hidden" : "visible"} ${
              selected === section.link ? "text-white" : "text-black"
            }`}
          >
            {section.title}
          </p>
        </div>
      </MenuItem>
    </div>
  ));

  return (
    <div >
      <Sidebar
        collapsed={collapsed}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`fixed top-0 left-0 h-full z-30 bg-white ${
          collapsed ? "w-28" : "w-72"
        } transition-all duration-300 border-r-2 border-[#3b3b3b]`}
      >
        <a href="/" className="flex items-center justify-center mt-10">
          <img src={logoLight} className="w-12" alt="logo" />
          <span
            className={`ml-4 text-3xl font-medium ${
              collapsed ? "hidden" : "flex"
            }`}
          >
            Mobile<p className="font-bold text-dark-green">Pro</p>
          </span>
        </a>
        <Menu
          className="flex flex-col mt-12 ml-4"
          menuItemStyles={{
            button: {
              // Disable default hover styles
              "&:hover": {
                backgroundColor: "transparent", // Set to transparent or your desired color
                color: "#333", // Set to your desired text color
              },
              // Active styles
              "&.active": {
                backgroundColor: "#6AA04B", // Your active background color
                color: "#fff", // Your active text color
              },
            },
          }}
        >
          {renderMenu}
        </Menu>
      </Sidebar>
      <main
        className={`p-8 w-full ${
          collapsed ? "ml-28" : "ml-72"
        } transition-all duration-200`}
        style={{ minWidth: 0 }}
      >
      </main>
    </div>
  );
};

export default Content;
