import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import useWindow from 'hooks/useWindowContext';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';
import ShadowButton from 'components/Buttons/ShadowButton';

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
        <ShadowButton style={{ aspectRatio: '1' }}>
          <OfficeIcons type="excel" size={20} onClick={getExcelFile} />
        </ShadowButton>
      )}
      {!hasUserSearch && (
        <ShadowButton
          active={isAsideOpen}
          style={{ width: '5rem' }}
          onClick={() => setIsAsideOpen((v) => !v)}>
          <FilterIcon style={{ marginInlineEnd: '0.3rem' }} />
          {Advanced}
        </ShadowButton>
      )}
    </Styled.AdvanceButtonsWrapper>
  );
};

export default SearchAdvancedButtons;
