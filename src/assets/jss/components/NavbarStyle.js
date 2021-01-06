const NavbarStyles = {
  navbar: {
    position: "fixed",
    top: "0rem",
    left: "0rem",
    right: "0rem",
    height: "3.5rem",
    zIndex: 2,
  },
  navMenu: {
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