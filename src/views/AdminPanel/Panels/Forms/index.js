import useScript from "hooks/useScript";

const Forms = () => {
  useScript("pageLoadScripts/LoadForms/LoadForms.js", "LoadForms.js", () => {
    window.loadForms();
  });
  return (
    <div
      id="formsArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: "0rem", padding: "0vw 6vw" }}
    ></div>
  );
};

export default Forms;
