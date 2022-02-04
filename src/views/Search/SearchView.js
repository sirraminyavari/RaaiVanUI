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
    RVDic: { All, Nodes, Users, Questions, Files },
    RVGlobal,
  } = useWindow();

  const allTypes = [
    { label: Nodes, value: 'Node' },
    RVGlobal?.SAASBasedMultiTenancy ? null : { label: Users, value: 'User' },
    RVGlobal?.Modules?.QA ? { label: Questions, value: 'Question' } : null,
    { label: Files, value: 'File' },
  ].filter((t) => !!t);

  const allOptions = [
    { label: All, value: allTypes.map((t) => t.value) },
  ].concat(allTypes.map((t) => ({ label: t.label, value: [t.value] })));

  const [searchText, setSearchText] = useState(
    SearchText === 'undefined' ? null : decodeBase64(SearchText)
  );

  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [togglesValue, setTogglesValue] = useState(DEFAULT_TOGGLE_VALUES);

  const [selectedType, setSelectedType] = useState({
    label: All,
    value: allTypes.map((t) => t.value),
  });

  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [selectedTemps, setSelectedTemps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lowerBoundary, setLowerBoundary] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  //! Reset toggles
  const onReset = () => {
    setTogglesValue(DEFAULT_TOGGLE_VALUES);
  };

  const doSearch = async ({ excel, moreMode } = {}) => {
    if (moreMode) setIsFetchingMore(true);

    const response = await search({
      searchText,
      lowerBoundary: moreMode ? lowerBoundary : 0,
      itemTypes: selectedType.value,
      hasTitle: togglesValue.title,
      hasFileContent: togglesValue.file,
      hasContent: togglesValue.content,
      hasDescription: togglesValue.excerpt,
      hasTags: togglesValue.keywords,
      typeIds: selectedTemps?.map((temp) => temp.NodeTypeId),
      types: togglesValue.fileTypes,
      isExcel: excel === true,
    });

    if (!excel) {
      if (moreMode) setIsFetchingMore(false);
      else setIsSearching(false);

      setLowerBoundary(response?.LastItem);
      setNoMore(response?.NoMore === true);
      setTotalCount(response?.TotalCount);

      const newItems = response?.Items || [];

      setSearchItems(
        moreMode
          ? [
              ...searchItems,
              ...newItems.filter(
                (i) => !searchItems.some((s) => s.ID === i.ID)
              ),
            ]
          : newItems
      );
    }
  };

  //! Download excel file.
  const getExcelFile = () => doSearch({ excel: true });

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
    if (selectedType?.value?.some((v) => v === 'User')) {
      setIsAsideOpen(false);
    }

    //! If there is search text, set isSearching to true.
    setIsSearching(true);

    let timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => doSearch(), 500);

    return () => {
      clearTimeout(timeout);
      setSearchItems([]);
    };
  }, [searchText, selectedType, togglesValue, selectedTemps]);

  const onScrollEnd = () => {
    if (!isFetchingMore && !noMore) doSearch({ moreMode: true });
  };

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
        allOptions,
        selectedType,
        setSelectedType,
        isSearching,
        isFetchingMore,
        setIsSearching,
        searchItems,
        setSearchItems,
        totalCount,
        selectedTemps,
        setSelectedTemps,
        isModalOpen,
        setIsModalOpen,
        getExcelFile,
        onScrollEnd,
      }}>
      <Styled.SearchViewContainer>
        <SearchMain />
        <SearchAside />
      </Styled.SearchViewContainer>
    </searchContext.Provider>
  );
};

export default SearchView;
