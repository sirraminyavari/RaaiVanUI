import { useContext, lazy, Suspense } from "react";
import { RVGlobalContext } from "context/RVGlobalProvider";
import { capitalize as Capital } from "helpers";
import NavbarStyle from "assets/jss/components/NavbarStyle";
const NotLogedInNav = lazy(() => import("./_NotLogedInNav"));
const LogedInNav = lazy(() => import("./_LogedInNav"));

const Navbar = () => {
  const {
    IsAuthenticated: isAuth,
    ApplicationID: appId,
    CurrentUser: user,
    SAASBasedMultiTenancy: isSaas,
  } = useContext(RVGlobalContext);
  return (
    <div
      className="WarmBackgroundColor RevTextAlign rv-not-printable"
      style={{
        ...NavbarStyle.navbar,
        [`padding${Capital(window.RV_Float)}`]: isAuth ? "12rem" : "",
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {isAuth ? (
          <LogedInNav appId={appId} isSaas={isSaas} />
        ) : (
          <NotLogedInNav />
        )}
      </Suspense>
    </div>
  );
};

export default Navbar;
