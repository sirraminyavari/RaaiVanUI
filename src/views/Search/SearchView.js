import { createContext, useState, useEffect } from 'react';
import * as Styled from './SearchView.styles';
import SearchAside from './items/SearchAside/SearchAside';
import SearchMain from './items/SearchMain/SearchMain';
import { decodeBase64, encodeBase64, getURL } from 'helpers/helpers';
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
  const [searchItems, setSearchItems] = useState([]);
  const [selectedTemps, setSelectedTemps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //! Reset toggles
  const onReset = () => {
    setTogglesValue(DEFAULT_TOGGLE_VALUES);
  };

  useEffect(() => {
    //! Update url path state.
    window.history.replaceState(
      null,
      null,
      getURL('Search', { SearchText: encodeBase64(searchText) })
    );

    //! If there is not search text, return early and set isSearching to false.
    if (!searchText) {
      setIsSearching(false);
      return;
    }

    //! If there is search text, set isSearching to true.
    setIsSearching(true);
    let timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      search({
        searchText,
        itemTypes: selectedType.value,
        hasTitle: togglesValue.title,
        hasFileContent: togglesValue.file,
        hasContent: togglesValue.content,
        hasDescription: togglesValue.excerpt,
        hasTags: togglesValue.keywords,
        typeIds: selectedTemps?.map((temp) => temp.NodeTypeId).join('|'),
      })
        .then((response) => {
          setSearchItems(response?.Items || []);
        })
        .catch((error) => {
          console.log(error);
          setSearchItems([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 500);

    return () => {
      clearTimeout(timeout);
      setSearchItems([]);
    };
  }, [searchText, selectedType, togglesValue, selectedTemps]);

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
        searchItems,
        setSearchItems,
        selectedTemps,
        setSelectedTemps,
        isModalOpen,
        setIsModalOpen,
      }}>
      <Styled.SearchViewContainer>
        <SearchMain />
        {isAsideOpen && <SearchAside />}
      </Styled.SearchViewContainer>
    </searchContext.Provider>
  );
};

export default SearchView;
