import React from "react";
import useScript from "hooks/useScript";

const Teams = () => {
  useScript("scripts/USR/ApplicationsManager.js","ApplicationsManager.js");
  useScript("scripts/CKEditor5/ckeditor.js", "ckeditor.js");
  useScript("scripts/CCKEditor5/translations/fa.js", "translations.js");

  //! Load Applications
  useScript("pageLoadScripts/LoadApplications/_1_applications.js", "1-applications.js");
  useScript("pageLoadScripts/LoadApplications/_2_applications.js", "2-applications.js");
  useScript("pageLoadScripts/LoadApplications/_3_applications.js", "3-applications.js");

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