import { useContext } from "react";
import { Link } from "react-router-dom";
import { RVGlobalContext } from "context/RVGlobalProvider";
import NavBtnComponent from "components/NavbarButton/NavBotton";
import NavbarStyle from "assets/jss/components/NavbarStyle";
import * as Buttons from "../ButtonsList";

const NavSearch = () => {
  const { ApplicationID: appId, SAASBasedMultiTenancy: isSaas } = useContext(
    RVGlobalContext
  );
  return (
    <>
      {appId && (
        <div className="show-for-large" style={NavbarStyle.searchContainer}>
          <div style={NavbarStyle.searchOptions}>
            <Link to={Buttons.SearchOptions.Advanced.linkTo}>
              <NavBtnComponent {...Buttons.SearchOptions.Advanced} />
            </Link>
            {!isSaas && (
              <>
                <div style={NavbarStyle.Saas1}>
                  <div style={NavbarStyle.Saas2}></div>
                </div>
                <NavBtnComponent {...Buttons.SearchOptions.Users} />
              </>
            )}
          </div>
          <div style={NavbarStyle.middle}>
            <div style={NavbarStyle.searchIcon}>
              <div style={NavbarStyle.middle}>
                <i
                  className="fa fa-search fa-lg rv-icon-button"
                  aria-hidden={true}
                />
              </div>
            </div>
            <input
              className="rv-input"
              placeholder={window.RVDic.Search}
              style={NavbarStyle.searchField}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NavSearch;
