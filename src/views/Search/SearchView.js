import { createContext, useState, useEffect } from 'react';
import * as Styled from './SearchView.styles';
import SearchAside from './items/SearchAside/SearchAside';
import SearchMain from './items/SearchMain/SearchMain';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';

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
  const [searchText, setSearchText] = useState(decodeBase64(SearchText));
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [togglesValue, setTogglesValue] = useState(DEFAULT_TOGGLE_VALUES);
  const [selectedType, setSelectedType] = useState({ label: All, value: '' });
  const [isSearching, setIsSearching] = useState(false);

  //! Reset toggles
  const onReset = () => {
    setTogglesValue(DEFAULT_TOGGLE_VALUES);
  };

  useEffect(() => {
    setIsSearching(true);
    let timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      setIsSearching(false);
    }, 1000);

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
