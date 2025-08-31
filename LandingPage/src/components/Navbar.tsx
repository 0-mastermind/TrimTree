import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
  return (
    <nav className="flex justify-between my-6 items-center gap-2">
      <div className="mr-14 flex items-center">
        <h1 className="text-2xl font-bold">TrimTree</h1>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <ul className="flex gap-8 text-[var(--text-gray-dark)] font-[500]">
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Reviews</a>
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        <ThemeToggler />
        <button className="bg-black dark:bg-[#6b6b6b] px-6 py-2 text-white rounded-xl text-sm">
          Contact Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
