import React from "react";
import useScript from "hooks/useScript";
import { isEmpty } from "helpers";

const Profile = (props) => {
  useScript(
    "pageLoadScripts/LoadProfile/LoadProfile.js",
    "LoadProfile.js",
    (user) => {
      !isEmpty(user) && window.loadProfile(user);
    },
    props.route
  );
  return (
    <>
      <div
        id="coverContainer"
        className="small-12 medium-12 large-12"
        style={styles.coverContainer}
      ></div>

      <div
        id="profileArea"
        className="small-12 medium-12 large-12"
        style={{ padding: "0vw 6vw", marginBottom: "8rem" }}
      ></div>
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
