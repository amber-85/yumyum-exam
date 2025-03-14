import MenuList from "../../components/menulist";
import Header from "../../components/header";
import "./menu.scss"

const MenuPage = () => {
  return (
    <div className="menu__wrapper">
      <Header />
      <MenuList />
    </div>
  );
};

export default MenuPage;
