import React, { useEffect } from "react";
import useScript from "hooks/useScript";

const Home = (props) => {
    useScript("pageLoadScripts/LoadHome/LoadHome.js", "LoadHome.js", () => {
      window.loadHome(props.route);
    });
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
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: "0rem" }}
    >
      <div
        className="small-12 medium-12 large-9"
        style={{ padding: "0rem 1rem" }}
      >
        <div
          id="pollsArea"
          className="small-12 medium-12 large-12"
          style={{ marginBottom: "1rem", padding: "0 4vw", display: "none" }}
        ></div>
        <div
          id="centerArea"
          className="small-12 medium-12 large-12"
          style={{ padding: "0 4vw" }}
        ></div>
      </div>
      <div
        id="sideInfo"
        className="small-12 medium-12 large-3 show-for-large"
      ></div>
    </div>
  );
};

export default Home;
