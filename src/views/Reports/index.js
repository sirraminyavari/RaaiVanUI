import useScript from "hooks/useScript";
import { isEmpty } from "helpers";

const Reports = (props) => {
  useScript(
    "pageLoadScripts/LoadReports/LoadReports.js",
    "LoadReports.js",
    (reports) => {
      !isEmpty(reports) && window.loadReports(reports);
    },
    props.route
  );
  return (
    <div
      id="reportsArea"
      className="small-12 medium-12 large-12"
      style={{ margin: "0rem", padding: "0vw 6vw", marginBottom: "5rem" }}
    ></div>
  );
};

export default Reports;
