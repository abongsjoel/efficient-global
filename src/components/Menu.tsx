const Menu = () => {
  return (
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
        <li>
          <a
            href="/services"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Opportunities
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Get In Touch
          </a>
        </li>
      </ul>
    </menu>
  );
};

export default Menu;
