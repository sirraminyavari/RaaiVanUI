import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';

const SearchAdvancedButtons = () => {
  const {
    isAsideOpen,
    setIsAsideOpen,
    getExcelFile,
    selectedType,
  } = useContext(searchContext);
  const {
    RVDic: { Advanced },
  } = useWindow();

  const hasNodeSearch = selectedType?.value?.split('|').includes('Node');
  const hasUserSearch = selectedType?.value?.split('|').includes('User');

  return (
    <Styled.AdvanceButtonsWrapper isAsideOpen={isAsideOpen}>
      {hasNodeSearch && (
        <OfficeIcons
          type="excel"
          size={20}
          className="search-export-excel"
          onClick={getExcelFile}
        />
      )}
      {!hasUserSearch && (
        <Button
          type="primary-o"
          classes="search-advanced-button"
          onClick={() => setIsAsideOpen((v) => !v)}>
          <FilterIcon />
          {Advanced}
        </Button>
      )}
    </Styled.AdvanceButtonsWrapper>
  );
};

export default SearchAdvancedButtons;
