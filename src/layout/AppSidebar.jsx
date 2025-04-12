import React, { useEffect, useCallback, useRef, useState,useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import Logo from "../images/1SourceLogo.jpg";
import oneSlogo from "../images/1SLogo.jpg";
import { AppContext } from '../context/AppContext'; 

const navItems = [
  {
    icon: <i className="fa-sharp fa-regular fa-calculator-simple text-[18px]"></i>,
    name: "Estimates", 
    path: "/",
    //subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <i className="fa-regular fa-file-invoice-dollar text-[18px]"></i>,
    name: "Salesorders",
    path: "/so",
  },
  {
    icon:<i className="text-[18px] fa-regular fa-palette"></i>,
    name: "Designorders",
    path: "/do",
  },
  // {
  //   name: "BOM",
  //   icon: <i className="fa-sharp fa-light fa-truck-moving text-[18px]"></i>,
  //   path: "/inventory",
  //   //subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Invoices",
  //   icon: <i className="fa fa-file-text text-[18px]"></i>,
  //   path: "/invoice",
  //   //subItems: [{ name: "Past Invoices", path: "/invoice", pro: false }],
  // },

  // {
  //   name: "Feedback",
  //   icon: <i className="fa-light fa-message-lines text-[18px]"></i>,
  //   path: "/feedback",
  //   // subItems: [
  //   //   { name: "404 Error", path: "/404", pro: false },
  //   //   { name: "Blank Page", path: "/blank", pro: false },
  //   // ],
  // },
  // {
  //   name: "Files",
  //   icon: <i className="fa-sharp fa-light fa-file text-[18px]"></i>,
  //   path: "/file",
  // },
  // {
  //   name: "Installs",
  //   icon: <i className="fa fa-gear text-[18px]"></i>,
  //   path: "/install",
  //   //subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Term & Condations",
  //   icon: <i className=" fa-light fa-desktop text-[18px]"></i>,
  //   path:"/term"
  //   //subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Help",
  //   icon: <i className="fa-sharp fa-regular fa-circle-info text-[18px]"></i>,
  //   path:"/help"
  //   //subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null); // Now a number or null
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => {
      if (path === "/") {
        return location.pathname === path || location.pathname.startsWith("/es-");
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index); // Set to index (number)
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = openSubmenu;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prevOpenSubmenu) =>
      prevOpenSubmenu === index ? null : index
    );
  };

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                >
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[index] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu === index
                    ? `${subMenuHeight[index]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[230px]"
            : isHovered
            ? "w-[230px]"
            : "w-[80px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src={Logo}
                alt="Logo"
                width={110}
              />
              <img
                className="hidden dark:block"
                src={Logo}
                alt="Logo"
                width={110}
              />
            </>
          ) : (
            <img src={oneSlogo} className="w-8" />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <i className="fa-regular fa-ellipsis text-[18px]"></i>
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;