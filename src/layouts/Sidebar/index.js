import SidebarOption from "./SidebarOption";
import { Link } from "react-router-dom";
import optionsList from "./optionsList";

const sideWidth = 18;
const getVersion = () => {
  let systemVersion = !(window.RVGlobal || {}).ShowSystemVersion
    ? null
    : (window.RVGlobal || {}).SystemVersion;
  if (systemVersion && systemVersion.toLowerCase()[0] === "v") {
    systemVersion = systemVersion.substring(1);
  }
  return systemVersion;
};

const Sidebar = () => {
  return (
    <div
      className="SoftBackgroundColor SurroundingShadow"
      id="sideContent"
      style={{
        position: "fixed",
        display: "flex",
        flexFlow: "column",
        top: "3.4rem",
        bottom: 0,
        width: `${sideWidth}rem`,
        // TODO: toggle right or left value based on menu click
        [window.RV_Float]: `${-sideWidth + 18}rem`,
      }}
    >
      <div
        id="serivces"
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
          paddingTop: "0.5rem",
        }}
      ></div>
      <div
        id="options"
        style={{
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: "auto",
          textAlign: "center",
          paddingBottom: "0.4rem",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "90%",
            paddingTop: "1px",
            backgroundColor: "rgb(220,220,220)",
          }}
        ></div>
      </div>
      <div
        id="options"
        style={{
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: "auto",
          textAlign: "center",
        }}
      >
        {optionsList.map((opt, key) => {
          return opt.linkTo ? (
            <Link to={opt.linkTo} key={key}>
              <SidebarOption {...opt} />
            </Link>
          ) : (
            <SidebarOption {...opt} key={key} />
          );
        })}
      </div>
      {getVersion() && (
        <div
          style={{
            flex: "0 1 auto",
            textAlign: "center",
            fontSize: "0.7rem",
            color: "rgb(80,80,80)",
          }}
        >
          <span>
            {window.RVDic.Version} {getVersion()}
          </span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
