import Menu from "../organisms/Menu";
import logo from "../../assets/logo_tans.png";

const Header = () => {
  return (
    <header className="bg-white text-black p-8 flex items-center justify-between relative sticky top-0 z-50">
      <a href="#hero" className="hover:opacity-80 transition-opacity">
        <img src={logo} alt="Logo" className="h-12" />
      </a>
      <Menu />
    </header>
  );
};

export default Header;
