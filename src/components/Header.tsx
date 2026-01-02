import Menu from "./Menu";

const Header = () => {
  return (
    <header className="bg-white text-black p-8 flex items-center justify-between">
      Logo
      <Menu />
    </header>
  );
};

export default Header;
