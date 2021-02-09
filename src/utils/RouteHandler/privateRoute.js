import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { RVGlobalContext } from 'context/RVGlobalProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { IsAuthenticated: isAuthenticated } = useContext(RVGlobalContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
