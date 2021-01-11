import { useContext } from "react";
import { RVGlobalContext } from "context/RVGlobalProvider";
import NavBtnComponent from "components/NavbarButton/NavBotton";
import NavbarStyle from "assets/jss/components/NavbarStyle";
import { capitalize as Capital } from "helpers";
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
            <NavBtnComponent {...Buttons.SearchOptions.Advanced} />
            {!isSaas && (
              <>
                <div style={Styled.Search1}>
                  <div style={Styled.Search2}></div>
                </div>
                <NavBtnComponent {...Buttons.SearchOptions.Users} />
              </>
            )}
          </div>
          {/* <div style="display:flex; flex-flow:row;">
            <div style="flex:1 1 auto;">1</div>
            <div style="flex:0 0 auto;">2</div>
          </div> */}
          <div style={{ ...Styled.middle, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                [window.RV_RevFloat]: "0.4rem",
              }}
            >
              <div style={Styled.middle}>
                <i
                  className="fa fa-search fa-lg rv-icon-button"
                  aria-hidden={true}
                ></i>
              </div>
            </div>
            <input
              className="rv-input"
              placeholder={window.RVDic.Search}
              style={{
                width: "100%",
                [`padding${Capital(window.RV_RevFloat)}`]: "2rem",
                borderWidth: 0,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

const Styled = {
  Search1: {
    display: "inline-block",
    padding: "0 0.2rem",
    height: "100%",
    position: "relative",
  },
  Search2: {
    position: "absolute",
    paddingRight: "1px",
    backgroundColor: "white",
    top: "0.8rem",
    bottom: "0.8rem",
  },
  middle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default NavSearch;
