import React from "react";
import useAllScripts from "hooks/useAllScripts";
import useCheckRoute from "hooks/useCheckRoute";

const scripts = [
  { src: "scripts/USR/ApplicationsManager.js", id: "ApplicationsManager.js" },
  {
    src: "pageLoadScripts/LoadApplications/_1_applications.js",
    id: "1-applications.js",
  },
  {
    src: "pageLoadScripts/LoadApplications/_2_applications.js",
    id: "2-applications.js",
  },
  {
    src: "pageLoadScripts/LoadApplications/_3_applications.js",
    id: "3-applications.js",
  },
];

const Teams = (props) => {
  useAllScripts(scripts);
  console.log(props);
  return (
    <>
      <div
        id="appsArea"
        className="small-12 medium-12 large-12 row"
        style={{ margin: "0rem 0rem 5rem 0rem", padding: "0vw 8vw" }}
      ></div>
    </>
  );
};

export default Teams;
