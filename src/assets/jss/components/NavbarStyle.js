import { capitalize as Capital } from "helpers";
const { IsAuthenticated: isAuth } = window.RVGlobal;

const NavbarStyles = {
  navbarContainer: {
    position: "fixed",
    top: "0rem",
    left: "0rem",
    right: "0rem",
    height: "3.5rem",
    zIndex: 2,
    [`padding${Capital(window.RV_Float)}`]: isAuth ? "12rem" : ""
  },
  logedInNav: {
    height: "100%",
    [`padding${window.RV_Float}`]: "1rem",
    display: "flex",
    flexFlow: "row"
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    [window.RV_Float]: 0,
    padding: "0 2px",
    width: "12rem",
    backgroundColor: "rgb(105,105,105)",
  },
  menuChild: {
    position: "absolute",
    top: 0,
    bottom: 0,
    [window.RV_RevFloat]: 0,
    backgroundColor: "white",
    [`padding${Capital(window.RV_RevFloat)}`]: "2px"
  },
  buttonsContainer: {
    flex: "1 1 auto",
    height: "100%"
  },
  searchContainer: {
    position: "relative",
    flex: "0 0 auto",
    height: "100%",
    width: `${window.searchBoxWidth}rem`,
    [`padding${window.RV_RevFloat}`]: `calc(4vw + ${window.searchButtonsWidth}rem)`,
  },
  searchOptions: {
    position:'absolute',
    top:0,
    bottom:0,
    [window.RV_RevFloat]:'4vw'
  }
};

export default NavbarStyles;