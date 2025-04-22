import React, { useEffect, useRef, useState,useContext } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { useSidebar } from "../context/SidebarContext"; 
import { AppContext } from "../context/AppContext";  
//import Cart from "../components/header/Cart"
 import UserDropdown from "../components/header/UserDropdown";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
const {showSearchPanel, setShowSearchPanel } = useContext(AppContext);
  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
 
  // Determine the destination based on the current path
  const linkDestination = () => {
    if (location.pathname === '/' || location.pathname.includes('/es')) {
      return '/es-create';
    } else if (location.pathname.includes('/so')) {
      return '/so-create';
    }
    else if (location.pathname.includes('/do')) {
      return '/do-create';
    }
    // You can return a default or fallback path if needed
    return '#'; // or any other default route
  };
  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b ">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-2 ">
          {!isHomePage ?
          <Link
            className="bg-white text-indigo-600"
            to={'/'}
          >
           <i className="fa fa-arrow-left mr-2"></i>
           Back
          </Link> : <span className=" text-indigo-600 font-roboto "><i className="fa-solid fa-chart-simple mr-1 text-2xl"></i>
           Kanban</span>
          }

          <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden"
              src="./images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none `}
        >
          <div className="flex items-center gap-2 2xsm:gap-3 mr-5">
              {/* <Cart /> */}
          </div>
          {/* <UserDropdown /> */}
          <div className="flex items-center gap-4">

          <button onClick={()=> setShowSearchPanel(!showSearchPanel)} className="border border-gray-100 px-1 hover:bg-gray-50 cursor-pointer"><i className="fa-sharp fa-solid fa-magnifying-glass"></i></button>

          <Link to={linkDestination()} className="border border-gray-100 px-[5px] cursor-pointer bg-brand-600 hover:bg-brand-700 text-white"><i className="fa-sharp fa-solid fa-plus"></i></Link>
          <span className="border border-gray-100 px-[5px] hover:bg-gray-50 cursor-pointer"><i className="fa-solid fa-bars"></i></span>
          
          
          
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;