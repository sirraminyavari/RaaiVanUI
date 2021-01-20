import useScript from "hooks/useScript";

const Knowledge = () => {
  useScript(
    "pageLoadScripts/LoadKnowledge/LoadKnowledge.js",
    "LoadKnowledge.js",
    () => {
      window.loadKnowledge();
    }
  );
  return (
    <div
      id="knowledgeArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: "0rem", marginBottom: "5rem", padding: "0vw 6vw" }}
    ></div>
  );
};

export default Knowledge;
