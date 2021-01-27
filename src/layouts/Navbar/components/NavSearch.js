import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RVGlobalContext } from 'context/RVGlobalProvider';
import NavBtnComponent from 'components/NavbarButton/NavBotton';
import NavbarStyle from 'assets/jss/components/NavbarStyle';
import * as Buttons from '../ButtonsList';

const searchIcon = (
  <div style={NavbarStyle.searchIcon}>
    <div style={NavbarStyle.middle}>
      <i className="fa fa-search fa-lg rv-icon-button" aria-hidden={true} />
    </div>
  </div>
);

const NavSearch = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const { ApplicationID: appId, SAASBasedMultiTenancy: isSaas } = useContext(
    RVGlobalContext
  );

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchField = () => {
    setSearchText('');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (searchText === '') return;
    clearSearchField();
    history.push(`/dosearch/${window.Base64.encode(searchText)}`);
  };

  const handleClickIcon = () => {
    clearSearchField();
  };

  return (
    <>
      {appId && (
        <div className="show-for-large" style={NavbarStyle.searchContainer}>
          <div style={NavbarStyle.searchOptions}>
            <Link to={Buttons.SearchOptions.Advanced.linkTo}>
              <NavBtnComponent {...Buttons.SearchOptions.Advanced} />
            </Link>
            {!isSaas && (
              <>
                <div style={NavbarStyle.Saas1}>
                  <div style={NavbarStyle.Saas2}></div>
                </div>
                <NavBtnComponent {...Buttons.SearchOptions.Users} />
              </>
            )}
          </div>
          <form onSubmit={handleSubmitForm}>
            <div style={NavbarStyle.middle}>
              {searchText !== '' ? (
                <Link
                  to={`/dosearch/${window.Base64.encode(searchText)}`}
                  onClick={handleClickIcon}>
                  {searchIcon}
                </Link>
              ) : (
                <>{searchIcon}</>
              )}
              <input
                className="rv-input"
                placeholder={window.RVDic.Search}
                onChange={handleChange}
                value={searchText}
                style={NavbarStyle.searchField}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default NavSearch;
