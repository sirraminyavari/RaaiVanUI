import React, { useEffect } from "react";
import useScript from "hooks/useScript";
import { isEmpty } from "helpers";

const Home = (props) => {
  useScript(
    "pageLoadScripts/LoadHome/LoadHome.js",
    "LoadHome.js",
    (home) => {
      !isEmpty(home) && window.loadHome(home);
    },
    props.route
  );
  //   useEffect(() => {
  //     window.GlobalUtilities.load_files(
  //       ["pageLoadScripts/LoadHome/LoadHome.js"],
  //       {
  //         OnLoad: function () {
  //           window.loadHome(props.route);
  //         },
  //       }
  //     );
  //   }, []);

  return (
    <div
      id="homeArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: "0rem" }}
    ></div>
  );
};

export default Home;
