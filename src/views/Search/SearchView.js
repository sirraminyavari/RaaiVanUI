import { createContext, useState, useEffect } from 'react';
import * as Styled from './SearchView.styles';
import SearchAside from './items/SearchAside/SearchAside';
import SearchMain from './items/SearchMain/SearchMain';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import { search } from 'apiHelper/apiFunctions';

export const searchContext = createContext({});

const DEFAULT_TOGGLE_VALUES = {
  title: true,
  excerpt: true,
  content: true,
  keywords: true,
  file: true,
};

const SearchView = (props) => {
  const { SearchText } = props?.route || {};
  const {
    RVDic: { All },
  } = useWindow();
  const [searchText, setSearchText] = useState(
    SearchText === 'undefined' ? null : decodeBase64(SearchText)
  );
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [togglesValue, setTogglesValue] = useState(DEFAULT_TOGGLE_VALUES);
  const [selectedType, setSelectedType] = useState({
    label: All,
    value: 'User|Node|Question|File',
  });
  const [isSearching, setIsSearching] = useState(false);

  //! Reset toggles
  const onReset = () => {
    setTogglesValue(DEFAULT_TOGGLE_VALUES);
  };

  useEffect(() => {
    if (!searchText) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    let timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      search({ searchText, itemTypes: selectedType.value })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchText, selectedType, togglesValue]);

  return (
    <searchContext.Provider
      value={{
        searchText,
        setSearchText,
        setIsAsideOpen,
        isAsideOpen,
        togglesValue,
        setTogglesValue,
        onReset,
        selectedType,
        setSelectedType,
        isSearching,
        setIsSearching,
      }}>
      <Styled.SearchViewContainer>
        <SearchMain />
        {isAsideOpen && <SearchAside />}
      </Styled.SearchViewContainer>
    </searchContext.Provider>
  );
};

export default SearchView;
