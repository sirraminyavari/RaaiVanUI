import { useRef } from 'react';
import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';
import SearchCtrl from './SearchCtrl';

const Search = (props) => {
  const node = useRef();

  const {} = SearchCtrl();

  useScript(
    'pageLoadScripts/LoadSearch/LoadSearch.js',
    'LoadSearch.js',
    (search) => {
      !isEmpty(search) &&
        !node?.current?.firstChild &&
        window.loadSearch(search);
    },
    props.route
  );
  return (
    // <div
    //   ref={node}
    //   id="searchArea"
    //   className="small-12 medium-12 large-12 row align-center"
    //   style={{
    //     margin: '0rem',
    //     marginBottom: '5rem',
    //     padding: '0vw 10vw',
    //   }}></div>
    <>search component goes here!</>
  );
};

export default Search;
