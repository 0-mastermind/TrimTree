import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-20 lg:mt-40 pb-12 lg:pb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold font-secondary dark:text-[var(--text-white)] text-gray-900">
              <Link href={"/"}>Trim Tree Salon</Link>
            </h1>
            <p className="text-sm lg:text-base max-w-md leading-relaxed text-gray-600 dark:text-[var(--text-gray-dark)]">
              A modern salon designed for modern people who value style and comfort.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-6">
            {/* Menu Links */}
            <div>
              <h2 className="font-semibold text-base lg:text-lg text-[var(--text-primary)] mb-3 lg:mb-5">
                Menu
              </h2>
              <ul className="flex flex-col gap-2 text-sm text-gray-600 dark:text-[var(--text-gray-dark)]">
                <li className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                  About
                </li>
                <li className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                  Services
                </li>
                <li className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                  Team
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="font-semibold text-base lg:text-lg text-[var(--text-primary)] mb-3 lg:mb-5">
                Socials
              </h2>
              <ul className="flex flex-col gap-2 text-sm text-gray-600 dark:text-[var(--text-gray-dark)]">
                <li className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                  Instagram
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="sm:col-span-1">
              <h2 className="font-semibold text-base lg:text-lg text-[var(--text-primary)] mb-3 lg:mb-5">
                Info
              </h2>
              <ul className="flex flex-col gap-3 text-sm text-gray-600 dark:text-[var(--text-gray-dark)]">
                {/* Email */}
                <li className="flex items-center group">
                  <span className="flex items-center justify-center text-white p-2 rounded-full mr-3 bg-[var(--bg-primary)] group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </span>
                  <span className="lowercase group-hover:text-[var(--text-primary)] transition-colors">
                    testing@mail.com
                  </span>
                </li>

                {/* Phone */}
                <li className="flex items-center group">
                  <span className="flex items-center justify-center text-white p-2 rounded-full mr-3 bg-[var(--bg-primary)] group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                    </svg>
                  </span>
                  <span className="group-hover:text-[var(--text-primary)] transition-colors">
                    +91 90909090
                  </span>
                </li>

                {/* Address */}
                <li className="flex items-center group">
                  <span className="flex items-center justify-center text-white p-2 rounded-full mr-3 bg-[var(--bg-primary)] group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"   
                      strokeLinejoin="round">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="group-hover:text-[var(--text-primary)] transition-colors">
                    Durgacity, HLD
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-5">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TrimTree. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
