import { Switch, Redirect, Route } from "react-router-dom";
import Routes from "routes";
import Navbar from "./Navbar";
import CheckRoute from "utils/CheckRoute/CheckRoute";

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
  return (
    <>
      <Navbar />
      <div
        className="small-12 medium-12 large-12 rv-content-section"
        style={{ position: "relative", paddingTop: "0.5rem", direction: "rtl" }}
      >
        {switchRoutes}
      </div>
    </>
  );
};

export default Main;
