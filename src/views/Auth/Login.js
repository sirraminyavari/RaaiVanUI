import React from "react";
import useAllScripts from "hooks/useAllScripts";

const scripts = [
  { src: "scripts/USR/LoginControl.js", id: "LoginControl.js" },
  { src: "pageLoadScripts/LoadLogin/LoadLogin.js", id: "LoadLogin.js" }
];

const Login = () => {
    useAllScripts(scripts);
  return (
    <>
      <div
        id="mainContent"
        className="small-12 medium-12 large-12"
        style={styles.mainContent}
      >
        <div style={{ width: "100%" }}>
          <div
            id="loginContainer"
            className="small-12 medium-8 large-6 rv-border-radius-1"
            style={styles.loginContainer}
          >
            <div id="loginArea" className="small-12 medium-12 large-12"></div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0.5rem",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <div
            id="pageDownButton"
            className="rv-air-button-base rv-air-button-white rv-circle"
            style={styles.pageDownButton}
          >
            <i className="fa fa-chevron-down fa-2x" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div
        id="statisticsArea"
        className="small-12 medium-12 large-12 row align-center"
        style={styles.statisticsArea}
      >
        <div
          className="small-12 medium-12 large-12"
          style={{
            textAlign: "center",
            paddingTop: "0.5rem",
            height: "4rem",
          }}
        >
          <div
            id="pageUpButton"
            className="rv-air-button-base rv-air-button-black rv-circle"
            style={styles.pageUpButton}
          >
            <i
              className="fa fa-chevron-up fa-2x"
              aria-hidden="true"
              style={{ marginBottom: "0.5rem" }}
            ></i>
          </div>
        </div>
        <div id="loginPageContent" style={styles.loginPageContent}></div>
      </div>
    </>
  );
};

const styles = {
  mainContent: {
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  loginContainer: {
    padding: "1rem 5rem",
    backgroundColor: "rgba(0,0,0,0.7)",
    margin: "0 auto",
  },
  pageDownButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
  },
  statisticsArea: {
    margin: "0rem",
    padding: "0vw 4vw",
    minHeight: "100vh",
    position: "relative",
  },
  pageUpButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
  },
  loginPageContent: {
    minHeight: "calc(100vh - 4rem)",
    width: "100%",
  },
};

export default Login;
