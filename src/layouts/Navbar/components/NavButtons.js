import { Link } from "react-router-dom";
import NavBtnComponent from "components/NavbarButton/NavBotton";
import NavbarStyle from "assets/jss/components/NavbarStyle";
import * as Buttons from "../ButtonsList";

const NavButtons = () => {
  return (
    <div style={NavbarStyle.buttonsContainer}>
      {Buttons.NavbarList.map((btn, key) => {
        return btn.linkTo ? (
          <Link to={btn.linkTo} key={key}>
            <NavBtnComponent {...btn} />
          </Link>
        ) : (
          <NavBtnComponent {...btn} key={key} />
        );
      })}
    </div>
  );
};

export default NavButtons;