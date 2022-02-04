import { createContext, useState, useEffect } from 'react';
import * as Styled from './SearchView.styles';
import SearchAside from './SearchAside/SearchAside';
import SearchMain from './SearchMain/SearchMain';
import { decodeBase64, encodeBase64, getURL } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import { search } from 'apiHelper/ApiHandlers/SearchAPI';

export const searchContext = createContext({});

const DEFAULT_TOGGLE_VALUES = {
  title: true,
  excerpt: true,
  content: true,
  keywords: true,
  file: true,
  description: true,
  answers: true,
  fileTypes: ['pdf', 'doc|docx', 'xlsx', 'ppt|pptx', 'xml', 'htm|html', 'txt'],
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

  //! Download excel file.
  const getExcelFile = () => {
    search({
      searchText,
      itemTypes: selectedType.value,
      hasTitle: togglesValue.title,
      hasFileContent: togglesValue.file,
      hasContent: togglesValue.content,
      hasDescription: togglesValue.excerpt,
      hasTags: togglesValue.keywords,
      typeIds: selectedTemps?.map((temp) => temp.NodeTypeId).join('|'),
      types: togglesValue.fileTypes.join('|'),
      isExcel: true,
    });
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

    //! If there is not advanced search for a type, close the aside section.
    //! In "All = Node | User | Question | File" and "User" search there is no advanced search.
    if (selectedType?.value?.split('|').includes('User')) {
      setIsAsideOpen(false);
    }

    //! If there is search text, set isSearching to true.
    setIsSearching(true);

    let timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      const response = await search({
        searchText,
        itemTypes: selectedType.value,
        hasTitle: togglesValue.title,
        hasFileContent: togglesValue.file,
        hasContent: togglesValue.content,
        hasDescription: togglesValue.excerpt,
        hasTags: togglesValue.keywords,
        typeIds: selectedTemps?.map((temp) => temp.NodeTypeId).join('|'),
        types: togglesValue.fileTypes.join('|'),
      });

      setIsSearching(false);

      setSearchItems(response?.Items || []);
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
        getExcelFile,
      }}>
      <Styled.SearchViewContainer>
        <SearchMain />
        <SearchAside />
      </Styled.SearchViewContainer>
    </searchContext.Provider>
  );
};

export default SearchView;
