import React from 'react';
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
//     <div className="w-screen h-screen overflow-y-auto overflow-x-auto">
//       <div>
//         {/* <AppSidebar />
//         <Backdrop /> */}
//       </div>
//       {/* <div
//         className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[230px]" : "lg:ml-[80px]"} ${isMobileOpen ? "ml-0" : ""}`}
//       >
        
//         <AppHeader />
//         <div className="">
         
//           <Outlet />
//         </div>
//       </div> */}
// <div>
//   <AppHeader />
//   <Outlet />
// </div>
//     </div>

<div className=''>
  <AppHeader />
  <Outlet />
</div>
  );
};
 
const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;