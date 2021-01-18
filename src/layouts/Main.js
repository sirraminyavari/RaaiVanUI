import { Switch, Redirect, Route } from "react-router-dom";
import Routes from "routes";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CheckRoute from "utils/CheckRoute/CheckRoute";
import useScript from "hooks/useScript";

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
      const { exact, path, component, name } = route;
      return (
        <Route
          key={key}
          exact={exact}
          path={path}
          render={(props) => (
            <CheckRoute component={component} name={name} props={props} />
          )}
        />
      );
    })}
    <Redirect from="/" to="/teams" />
  </Switch>
);

const Main = () => {
  const paddingName = window.RV_RTL ? "paddingRight" : "paddingLeft";
  //   useScript("pageLoadScripts/LoadMainLayout/LoadMain.js", "loadMain.js");
  return (
    <>
      <Navbar />
      <div
        //id="mainContentSection"
        className="small-12 medium-12 large-12 rv-content-section"
        style={{
          position: "relative",
          paddingTop: "0.5rem",
          direction: "rtl",
          // TODO: toggle padding value based on menu click
          [paddingName]: "18rem",
        }}
      >
        <Sidebar />
        {switchRoutes}
      </div>
    </>
  );
};

export default Main;
