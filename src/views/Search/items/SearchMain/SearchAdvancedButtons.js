import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';

const SearchAdvancedButtons = () => {
  const { isAsideOpen, setIsAsideOpen, getExcelFile } = useContext(
    searchContext
  );
  const {
    RVDic: { Advanced },
  } = useWindow();

  return (
    <Styled.AdvanceButtonsWrapper isAsideOpen={isAsideOpen}>
      <OfficeIcons
        type="excel"
        size={20}
        className="search-export-excel"
        onClick={getExcelFile}
      />
      <Button
        type="primary-o"
        classes="search-advanced-button"
        onClick={() => setIsAsideOpen((v) => !v)}>
        <FilterIcon />
        {Advanced}
      </Button>
    </Styled.AdvanceButtonsWrapper>
  );
};

export default SearchAdvancedButtons;
