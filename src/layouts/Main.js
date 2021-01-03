import useScript from "hooks/useScript";
import { Route, Switch } from "react-router-dom";
import Routes from "routes";

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
      return (
        <Route
          exact={route.exact}
          path={route.path}
          component={route.component}
          key={key}
        />
      );
    })}
  </Switch>
);

const Main = () => {
  useScript("/load/pageLoadScripts/LoadMainLayout/LoadMain.js", "loadMain.js");
  return (
    <div
      id="mainContentSection"
      className="small-12 medium-12 large-12 rv-content-section"
      style={{ position: "relative", paddingTop: "0.5rem" }}
    >
      {switchRoutes}
    </div>
  );
};

export default Main;
