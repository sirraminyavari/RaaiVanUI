import useScript from "hooks/useScript";

const MapConfig = () => {
  useScript(
    "pageLoadScripts/LoadMapConfig/LoadMapConfig.js",
    "LoadMapConfig.js",
    () => {
      window.loadMapConfig();
    }
  );
  return (
    <div
      id="mapArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: "0rem", marginBottom: "5rem", padding: "0vw 6vw" }}
    ></div>
  );
};

export default MapConfig;
