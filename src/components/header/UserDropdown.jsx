import React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from '../../context/AppContext'; 
const UserDropdown = () => {
  const { loginUser, setLoginUser } = useContext(AppContext);
  let username = "Your Name";
  if(loginUser && loginUser.Email){
    username = loginUser.Email.split("@")[0];
  }
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative z-10" ref={accountDropdownRef}>
    <button
      onClick={() => setIsAccountOpen(!isAccountOpen)}
      className="flex items-center space-x-2"
    >
      <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb51ZwKCKqU4ZrB9cfaUNclbeRiC-V-KZsfQ&s"
                alt="Profile"
                className="w-[44px] h-[44px] rounded-full"
              />
    </button>

      {/* Account Dropdown Menu */}
      {isAccountOpen && (
        <div className="absolute right-0 mt-2 flex w-[260px] flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center space-x-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb51ZwKCKqU4ZrB9cfaUNclbeRiC-V-KZsfQ&s"
                alt="Profile"
                 className="w-[44px] h-[44px] rounded-full"
              />
                   <div className="max-w-xs"> {/* Optional: Set as per your design */}
  <p className="text-sm font-semibold text-gray-700">{username}</p>
  <p className="text-xs text-gray-500 break-all">{loginUser.Email || "example@mail.com"}</p> {/* Use break-all for immediate breaks */}
</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-lg"
            >
              <span className=" mr-3 text-gray-600">
                <i className="fa-light fa-circle-user text-[18px]"></i>
              </span>
              <span>Profile</span>
            </a>
            
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-lg"
            >
              <span className=" mr-3 text-gray-600 ">
                <i className="fa-light fa-gear text-[18px]"></i>
              </span>
              <span>Settings</span>
            </a>
          </div>

          {/* Logout */}
          <div className="border-t py-2">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 hover:rounded-lg"
            >
              <span className="mr-3 text-red-500">
                <i className="fa-light text-[18px] fa-right-from-bracket"></i>
              </span>
              <span>Logout</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;