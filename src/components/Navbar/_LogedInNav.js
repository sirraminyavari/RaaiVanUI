import { Link } from "react-router-dom";
import CustomButton from "components/CustomButton/CustomButton";
import NavbarStyle from "assets/jss/components/NavbarStyle";
import { capitalize as Capital } from "helpers";

const LogedInNav = ({appId, isSaas}) => {
  return (
    <>
      <div className="RevDirection RevTextAlign" style={NavbarStyle.navMenu}>
        <div
          style={{
            ...NavbarStyle.menuChild,
            [`padding${Capital(window.RV_RevFloat)}`]: "2px",
          }}
        ></div>
        <CustomButton
          isMenu={true}
          dontHide={true}
          icon="fa-user-circle"
          title={window.RVDic.WorkTable}
          name="worktableButton"
          onClickButton={() => alert("clicked")}
        />
      </div>
      <div
        className="small-12 medium-12 large-12 Direction TextAlign"
        style={{
          height: "100%",
          [`padding${window.RV_Float}`]: "1rem",
          display: "flex",
          flexFlow: "row",
        }}
      >
        <div style={{ flex: "1 1 auto", height: "100%" }}>
          {appId && (
            <Link to="/home">
              <CustomButton
                icon="fa-home"
                title={window.RVDic.Home}
                dontHide={true}
                hideForLarge={true}
              />
            </Link>
          )}
          {isSaas && (
            <Link to="/teams">
              <CustomButton icon="fa-users" title={window.RVDic.Teams} />
            </Link>
          )}
          {appId && (
            <CustomButton
              icon="fa-envelope"
              title={window.RVDic.Messages}
              onClickButton={() => alert("Messages button clicked")}
            />
          )}
          {
            <CustomButton
              icon="fa-inbox"
              title={window.RVDic.Dashboard}
              onClickButton={() => alert("Dashboard button clicked")}
            />
          }
          {appId && (
            <CustomButton icon="fa-bell-o" title={window.RVDic.Notifications} />
          )}
        </div>
        {appId && (
          <div className="show-for-large" style={NavbarStyle.searchContainer}>
            <div style={NavbarStyle.searchOptions}>
              <CustomButton title={window.RVDic.Advanced} icon="fa-filter" />
              <div
                style={{
                  display: "inline-block",
                  padding: "0 0.2rem",
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    paddingRight: "1px",
                    backgroundColor: "white",
                    top: "0.8rem",
                    bottom: "0.8rem",
                  }}
                ></div>
              </div>
              <CustomButton
                title={window.RVDic.KnowledgeWorkers}
                icon="fa-address-card-o"
              />
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  [window.RV_RevFloat]: "0.4rem",
                }}
              >
                <div>
                  <i
                    className="fa fa-search fa-lg rv-icon-button"
                    aria-hidden={true}
                  ></i>
                </div>
              </div>
              {/* <input
                className="rv-input"
                style={{
                  width: "100%",
                  [`padding${Capital(window.RV_RevFloat)}`]: "2rem",
                  borderWidth: 0,
                }}
              /> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LogedInNav;
