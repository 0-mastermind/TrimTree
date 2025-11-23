"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/utils/api/auth";
import {
  Home,
  UserRound,
  LogOut,
  Menu,
  X,
  Calendar,
  CalendarCheck,
  CalendarClock,
  User,
  ChevronDown,
  ClipboardClock,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, FormEvent, useRef } from "react";

interface NavItems {
  href: string;
  label: string;
  icon: React.ReactElement;
}

// Navigation items
const adminRoutes = [
  {
    href: "/dashboard/admin/branches",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/dashboard/admin/staff-list",
    label: "Staff Management",
    icon: <UserRound className="h-5 w-5" />,
  },
];

// manager routes
const managerRoutes = [
  {
    href: "/dashboard/manager",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/dashboard/manager/staff-list",
    label: "Staff Members",
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    href: "/dashboard/manager/set-holiday",
    label: "Set Holiday",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  {
    href: "/dashboard/manager/approvals",
    label: "Leave Approvals",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    href: "/dashboard/manager/view-calendar",
    label: "Team Calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    href: "/dashboard/manager/appointments",
    label: "Appointments",
    icon: <ClipboardClock />
  }
];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const parts = pathname.split("/").slice(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [navItems, setNavItems] = useState<NavItems[] | []>([]);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const headerDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll effect for navbar
  useEffect(() => {
    if (!isLoggedIn) return;

    if (user && user.role === "ADMIN") {
      setNavItems(adminRoutes);
    } else {
      setNavItems(managerRoutes);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopDropdownOpen(false);
      }
      if (
        headerDropdownRef.current &&
        !headerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHeaderDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const buffer = () => isDesktopDropdownOpen;
    buffer();
  }, [isDesktopDropdownOpen]) 
  
  const handleLogout = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res: boolean = await dispatch(logout());

      if (res) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col fixed h-full z-30">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-primary to-primary/95 shadow-xl">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <div className="text-white font-bold text-xl tracking-tight">
                  TrimTree
                </div>
                <div className="text-white/60 text-xs font-medium">
                  Workforce Management
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider px-4 mb-4">
              Navigation
            </div>
            {navItems &&
              navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:translate-x-1 ${
                      isActive
                        ? "bg-white text-primary shadow-lg shadow-white/20"
                        : "text-white/90 hover:bg-white/10 hover:shadow-md"
                    }`}>
                    <div
                      className={`flex items-center justify-center w-5 h-5 transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-white/80 group-hover:text-white"
                      }`}>
                      {item.icon}
                    </div>
                    <span className="ml-3 transition-all duration-200">
                      {item.label}
                    </span>
                    {hoveredItem === item.href && !isActive && (
                      <div className="ml-auto w-2 h-2 bg-white/40 rounded-full transition-all duration-200"></div>
                    )}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* Profile Section */}
          <div className="flex-shrink-0 border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 w-full p-3 rounded-xl">
              <div className="relative">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-sm font-bold text-white">
                    {user?.name ? getInitials(user.name) : "U"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white font-semibold text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-white/60 text-xs capitalize font-medium">
                  {user?.role?.toLowerCase() || "Role"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Enhanced Navbar */}
        <header
          className={`sticky top-0 z-40 transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100"
              : "bg-white shadow-sm border-b border-gray-100"
          }`}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Logo */}
            <div className="flex items-center lg:hidden">
              <div className="flex items-center space-x-2">
                <div className="text-gray-900 font-bold text-lg">TrimTree</div>
              </div>
            </div>

            {/* Desktop Page Title */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {navItems.find((item) => item.href === pathname)?.label ||
                  "Dashboard"}
              </h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}

              {/* Settings Dropdown */}
              <div className="relative" ref={headerDropdownRef}>
                <button
                  onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user?.name ? getInitials(user.name) : "U"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isHeaderDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user?.name ? getInitials(user.name) : "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 capitalize font-medium">
                            {user?.role?.toLowerCase() || "Role"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsHeaderDropdownOpen(false)}>
                        <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="font-medium">View Profile</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          handleLogout(e);
                          setIsHeaderDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group">
                        <LogOut className="h-4 w-4 mr-3 group-hover:text-red-700 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Enhanced Breadcrumbs */}
            <div className="px-4 sm:px-6 lg:px-8">
              {pathname !== "/dashboard" && (
                <div className="py-4">
                  <nav className="flex items-center space-x-2 text-sm">
                    {parts.map((item, index) => {
                      const href = "/" + parts.slice(0, index + 1).join("/");
                      const isLast = index === parts.length - 1;
                      const isSecondLast = index === parts.length - 2;

                      // On mobile, show only last 2 items
                      const showOnMobile = isLast || isSecondLast;

                      return (
                        <div
                          key={item}
                          className={`flex items-center ${
                            !showOnMobile ? "hidden sm:flex" : ""
                          }`}>
                          {index > 0 && (
                            <svg
                              className="w-4 h-4 text-gray-400 mx-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                          {isLast ? (
                            <span className="capitalize font-semibold text-gray-900 px-3 py-1 bg-gray-100 rounded-lg">
                              {item.replaceAll("%20", " ").replaceAll("-", " ")}
                            </span>
                          ) : (
                            <Link
                              className="capitalize font-medium text-gray-600 hover:text-primary px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                              href={href}>
                              {item.replaceAll("%20", " ").replaceAll("-", " ")}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>

            <div className="py-4">{children}</div>
          </div>
        </main>
      </div>

      {/* Enhanced Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}></div>
        <div
          className={`fixed inset-y-0 left-0 max-w-xs w-full bg-gradient-to-b from-primary to-primary/95 shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg m flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div className="text-white font-bold text-lg">TrimTree</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-white hover:bg-white/10 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <div className="text-white/60 text-xs font-semibold uppercase tracking-wider px-4 mb-4">
                Navigation
              </div>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white text-primary shadow-lg"
                        : "text-white/90 hover:bg-white/10"
                    }`}>
                    <div
                      className={`flex items-center justify-center w-5 h-5 ${
                        isActive ? "text-primary" : "text-white/80"
                      }`}>
                      {item.icon}
                    </div>
                    <span className="ml-3">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Profile Section */}
            <div className="flex-shrink-0 border-t border-white/10 p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-sm font-bold text-white">
                      {user?.name ? getInitials(user.name) : "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-white/60 text-xs capitalize font-medium">
                    {user?.role?.toLowerCase() || "Role"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
