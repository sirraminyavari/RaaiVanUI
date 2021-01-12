import { capitalize as Capital } from "helpers";
const { IsAuthenticated: isAuth, SAASBasedMultiTenancy: isSaas } = window.RVGlobal;
const searchBoxWidth = isSaas ? "25.2" : "21";
const searchButtonsWidth = isSaas ? "4.5" : "8.7";

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
    display: "flex",
    flexFlow: "row-reverse wrap",
    width: `${searchBoxWidth}rem`,
    [`padding${window.RV_RevFloat}`]: `calc(4vw + ${searchButtonsWidth}rem)`,
  },
  searchOptions: {
    [`padding${Capital(window.RV_RevFloat)}`]: "5vw",
    [`padding${Capital(window.RV_Float)}`]: "1vw",
  },
  Saas1: {
    display: "inline-block",
    padding: "0 0.2rem",
    height: "100%",
    position: "relative",
  },
  Saas2: {
    position: "absolute",
    paddingRight: "1px",
    backgroundColor: "white",
    top: "0.8rem",
    bottom: "0.8rem",
  },
  middle: {
    flex: "1 1 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  searchIcon: {
    display: "flex",
    position: "absolute",
    top: 0,
    bottom: 0,
    [window.RV_RevFloat]: "0.4rem",
  },
  searchField: {
    width: "100%",
    [`padding${Capital(window.RV_RevFloat)}`]: "2rem",
    borderWidth: 0,
  },
};

export default NavbarStyles;