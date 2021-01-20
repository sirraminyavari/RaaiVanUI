import useScript from "hooks/useScript";
import { isEmpty } from "helpers";

const Search = (props) => {
  useScript(
    "pageLoadScripts/LoadSearch/LoadSearch.js",
    "LoadSearch.js",
    (searchText) => {
      !isEmpty(searchText) && window.loadSearch(searchText);
    },
    props.route
  );
  return (
    <div
      id="searchArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: "0rem", marginBottom: "5rem", padding: "0vw 10vw" }}
    ></div>
  );
};

export default Search;
