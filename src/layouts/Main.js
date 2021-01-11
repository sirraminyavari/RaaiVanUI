import { Switch } from "react-router-dom";
import Routes from "routes";
import Navbar from "./Navbar";
import ProtectedRoute from "utils/RouteHandler/protectedRoute";

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
      const { exact, path, component } = route;
      return (
        <ProtectedRoute exact={exact} path={path} component={component} key={key} />
      );
    })}
  </Switch>
);

const Main = () => {
  return (
    <>
      <Navbar />
      <div
        className="small-12 medium-12 large-12 rv-content-section"
        style={{ position: "relative", paddingTop: "0.5rem" }}
      >
        {switchRoutes}
      </div>
    </>
  );
};

export default Main;
