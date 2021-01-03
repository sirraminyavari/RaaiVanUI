import React from "react";
import useScript from "hooks/useScript";

const Profile = () => {
  useScript("/load/pageLoadScripts/LoadProfile/_1_profile.js", "1-profile.js");
  useScript("/load/pageLoadScripts/LoadProfile/_2_profile.js", "2-profile.js");
  useScript("/load/pageLoadScripts/LoadProfile/_3_profile.js", "3-profile.js");
  return (
    <>
      <div
        id="coverContainer"
        className="small-12 medium-12 large-12"
        style={styles.coverContainer}
      ></div>

      <div
        className="small-12 medium-12 large-12"
        style={{ padding: "0vw 6vw", marginBottom: "8rem" }}
      >
        <div id="tabsArea" className="small-12 medium-12 large-12"></div>

        <div id="socialArea" className="small-12 medium-12 large-12"></div>
        <div id="resumeArea" className="small-12 medium-12 large-12"></div>
        <div
          id="wikiArea"
          className="small-12 medium-12 large-12"
          style={{ marginTop: "1rem" }}
        >
          <div id="wikiContent" className="small-12 medium-12 large-12"></div>
        </div>
        <div id="relatedArea" className="small-12 medium-12 large-12"></div>
      </div>
    </>
  );
};

const styles = {
  coverContainer: {
    position: "relative",
    marginTop: "-2.2rem",
    marginBottom: "1rem",
    height: "18rem",
  },
};

export default Profile;
