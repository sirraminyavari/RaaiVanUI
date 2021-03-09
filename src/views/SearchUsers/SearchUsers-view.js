import useScript from 'hooks/useScript';

const SearchUsersView = () => {
  useScript(
    'pageLoadScripts/LoadUserSearch/LoadUserSearch.js',
    'LoadUserSearch.js',
    () => {
      window.loadUserSearch();
    }
  );
  return (
    <div
      id="searchArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: '0rem', padding: '0vw 10vw' }}></div>
  );
};

export default SearchUsersView;
