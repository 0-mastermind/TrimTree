"use client";
import { AppDispatch } from "@/store/store";
import { logout } from "@/utils/api/auth";
import {
  Home,
  UserRound,
  ChevronRight,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const parts = pathname.split("/").slice(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    {
      href: "/dashboard/admin",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/staff-list",
      label: "Staff List",
      icon: <UserRound className="h-5 w-5" />,
    },
  ];

  const handleLogout = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("heello");
    try {
      const res: boolean = await dispatch(logout());

      if (res) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-60 lg:flex-col fixed h-full">
        <div className="flex flex-col flex-grow bg-primary pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="text-white font-bold text-2xl">TrimTree</div>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-focus text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}>
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-white/20 p-4">
            <button
              onClick={(e) => handleLogout(e)}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-60 flex flex-col flex-1">
        {/* Navbar */}
        <header
          className={`sticky top-0 z-40 transition-all duration-300 ${
            isScrolled ? "bg-primary shadow-md" : "bg-primary"
          }`}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="rounded-md p-2 text-white hover:bg-white/10 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center lg:hidden">
              <div className="text-white font-bold text-xl">TrimTree</div>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-focus text-white"
                        : "text-white/90 hover:bg-white/10"
                    }`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center">
              <button className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            {pathname !== "/dashboard" && (
              <div className="breadcrumbs text-sm mb-6 mt-4">
                <ul>
                  {/* <li>
                    <Link
                      href="/dashboard"
                      className="text-primary hover:text-primary-focus font-medium">
                      Dashboard
                    </Link>
                  </li> */}
                  {parts.map((item, index) => {
                    const href = "/" + parts.slice(0, index + 1).join("/");
                    const isLast = index === parts.length - 1;
                    return (
                      <li key={item}>
                        {isLast ? (
                          <span className="capitalize font-semibold text-gray-600">
                            {item.replace("%20", " ")} 
                          </span>
                        ) : (
                          <Link
                            className="capitalize font-medium text-primary hover:text-primary-focus"
                            href={href}>
                            {item}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
        <div
          className="fixed inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}></div>
        <div
          className={`fixed inset-y-0 left-0 max-w-xs w-full bg-primary shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
              <div className="text-white font-bold text-xl">TrimTree</div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-white hover:bg-white/10">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-focus text-white"
                        : "text-white/90 hover:bg-white/10"
                    }`}>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex-shrink-0 flex border-t border-white/20 p-4">
              <button
                onClick={(e) => handleLogout(e)}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
