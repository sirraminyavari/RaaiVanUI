import { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { ThemeContext } from "context/ThemeProvider";
import Routes from "routes";
import Navbar from "./New/Navbar";
import Sidebar from "./New/Sidebar";
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
  const { isOpen } = useContext(ThemeContext);
  const marginName = window.RV_RTL ? "marginRight" : "marginLeft";
  return (
    <div style={{ direction: "rtl" }}>
      <Sidebar />
      <div
        style={{
          [marginName]: "250px",
          height: "100vh",
        }}
      >
        <Navbar />
        <div style={{ marginTop: "100px" }}>
          {switchRoutes}
        </div>
      </div>
    </div>
  );
};

export default Main;
