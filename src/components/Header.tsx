const Header = () => {
  return (
    <header className="bg-white text-black p-8 flex items-center justify-between">
      Logo
      <menu>
        <ul className="flex gap-4">
          <li>
            <a href="/" className="border-b-2 border-black pb-1 font-semibold">
              Home
            </a>
          </li>
          <li>
            <a
              href="/services"
              className="hover:border-b-2 hover:border-black pb-1"
            >
              Services
            </a>
          </li>
        </ul>
      </menu>
    </header>
  );
};

export default Header;
