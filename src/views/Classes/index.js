import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers';

const AdvancedSearch = (props) => {
  useScript(
    'pageLoadScripts/LoadAdvancedSearch/LoadAdvancedSearch.js',
    'LoadAdvancedSearch.js',
    (advancedsearch) => {
      !isEmpty(advancedsearch) && window.loadAdvancedSearch(advancedsearch);
    },
    props.route
  );
  return (
    <div
      id="classesArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: '0rem 0rem 5rem 0rem', padding: '0vw 8vw' }}></div>
  );
};

export default AdvancedSearch;
