import Image from "next/image";
import ThemeToggler from "./ThemeToggler";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="hidden md:flex justify-between my-6 items-center gap-2">
      <div className="mr-14 flex items-center flex-col">
        {/* <Image src="/images/logo_light.png" height={70} width={100} alt="Trimtree Logo" className="dark:hidden"/> */}
        <Image
          src="/images/logo.png"
          height={75}
          width={75}
          alt="Trimtree Logo"
        />
        <Link href={"/"}></Link>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <ul className="flex gap-8 font-[500]">
          <li>
            <Link
              href="/#about"
              className="font-secondary text-[var(--text-gray-dark)] dark:text-[var(--text-white)]">
              About
            </Link>
          </li>
          <li>
            <Link
              href="/#services"
              className="font-secondary text-[var(--text-gray-dark)] dark:text-[var(--text-white)]">
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/#team"
              className="font-secondary text-[var(--text-gray-dark)] dark:text-[var(--text-white)]">
              Our Team
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        <ThemeToggler />
        <Link
          href={"#footer"}
          className="bg-black dark:bg-[#6b6b6b] px-6 py-3 text-white rounded-xl text-sm font-secondary cursor-pointer">
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
