import useScript from "hooks/useScript";

const Help = () => {
  useScript("pageLoadScripts/LoadHelp/LoadHelp.js", "LoadHelp.js", () => {
    window.loadHelp();
  });
  return (
    <div
      id="helpArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: "0rem", padding: "1rem 6vw" }}
    ></div>
  );
};

export default Help;
