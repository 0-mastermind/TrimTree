"use client"
import { Home, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const parts = pathname.split("/").slice(1);
  
  useEffect(() => {
    console.log(pathname);
  }, [])
  
  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-primary w-full fixed top-0 z-50">
          <div className="flex justify-between items-center w-full md:px-4">
            <div className="mx-2 flex-1 px-2 font-bold text-2xl text-white">
              TrimTree
            </div>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                <li>
                  <Link href={"/dashboard/admin"} className="text-white">
                    <Home className="h-5 w-5" /> Home
                  </Link>
                </li>
                <li>
                  <Link href={"/dashboard/staff-list"} className="text-white">
                    <UserRound className="h-5 w-5" /> Staff List
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex-none lg:hidden ">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn rounded-md btn-ghost hover:bg-gray-700/40 border-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-white">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
        {/* Page content here */}
        <div className="mt-20">
          <div className="max-w-[95%] mx-auto">
            <div className={pathname === "/dashboard" ? "hidden" : "block breadcrumbs text-sm"}>
              <ul>
                {
                  parts.map((item, index) =>  {
                    const href = "/" + parts.slice(0, index + 1).join("/");
                    return <li key={item}>
                      <Link className="capitalize font-semibold" href={href}>{item}</Link>
                    </li>
                  })
                }
              </ul>
            </div>

            {children}
          </div>
        </div>
      </div>
      <div className="drawer-side z-999">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu min-h-[100px] relative top-15 w-60 p-4 bg-primary">
          <li>
            <Link href={"/dashboard/admin"} className="text-white">
              <Home className="h-5 w-5" /> Home
            </Link>
          </li>
          <li>
            <Link href={"/dashboard/staff-list"} className="text-white">
              <UserRound className="h-5 w-5" /> Staff List
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
