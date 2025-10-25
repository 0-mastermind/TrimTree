import ThemeToggler from "./ThemeToggler";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="hidden md:flex justify-between my-6 items-center gap-2">
      <div className="mr-14 flex items-center">
        {/* <Image src="/images/logo_light.png" height={70} width={100} alt="Trimtree Logo" className="dark:hidden"/>
        <Image src="/images/logo_dark.png" height={70} width={100} alt="Trimtree Logo" className="hidden dark:block"/> */}
        <h1 className="text-2xl font-bold font-secondary dark:text-[var(--text-white)]">
          <Link href={"/"}>TrimTree</Link>
        </h1>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <ul className="flex gap-8 font-[500]">
          <li>
            <Link href="/#about" className="font-secondary text-[var(--text-gray-dark)] dark:text-[var(--text-white)]">About</Link>
          </li>
          <li>
            <Link href="/#services" className="font-secondary text-[var(--text-gray-dark)] dark:text-[var(--text-white)]">Services</Link>
          </li>
          <li>
            <Link href="/#team" className="font-secondary text-[var(--text-gray-dark)] dark:text-[var(--text-white)]">Our Team</Link>
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        <ThemeToggler />
        <button className="bg-black dark:bg-[#6b6b6b] px-6 py-3 text-white rounded-xl text-sm font-secondary cursor-pointer">
          Contact Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
