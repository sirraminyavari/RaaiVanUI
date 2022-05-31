/**
 * Renders a decent search area for sidebar.
 */
import { useSelector, useDispatch } from 'react-redux';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';
import { INTRO_ONBOARD } from 'constant/constants';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

const SearchBox = () => {
  const dispatch = useDispatch();

  const { actions: sidebarActions } = useSidebarSlice();
  const { searchText } = useSelector(selectSidebar);
  const { name: onboardingName } = useSelector(selectOnboarding);
  const { RVGlobal, RVDic } = useWindow();

  //! Calls on every change that happens at input value
  //! ...and updates redux state.
  const handleChange = (e) => {
    dispatch(sidebarActions.setSearchText(e.target.value));
  };

  //! Clears search text when user clicks on cancel icon.
  const handleClearSearchText = (e) => {
    dispatch(sidebarActions.setSearchText(''));
  };

  //! Check if user in typing or not.
  const isTyping = !!searchText.length;

  const isSaas = RVGlobal?.SAASBasedMultiTenancy;
  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  const SearchPlaceholder = isSaas
    ? RVDic.SearchInN.replace(
        '[n]',
        RVDic.NodeTypes + ' ' + RVDic.And + ' ' + RVDic.Categories
      )
    : RVDic.SearchInN.replace('[n]', RVDic.NodeTypes);

  return (
    <Styled.SearchWrapper>
      <Styled.CancelIconWrapper
        isTyping={isTyping}
        onClick={handleClearSearchText}
      >
        <CancelIcon />
      </Styled.CancelIconWrapper>
      <Styled.SearchInput
        text={SearchPlaceholder}
        onChange={handleChange}
        value={searchText}
        isTyping={isTyping}
        readOnly={isIntroOnboarding}
      />
      <Styled.FilterIconWrapper>
        <FilterIcon />
      </Styled.FilterIconWrapper>
    </Styled.SearchWrapper>
  );
};

export default SearchBox;
