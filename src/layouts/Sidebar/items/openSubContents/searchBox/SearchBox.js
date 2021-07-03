/**
 * Renders a decent search area for sidebar.
 */
import { useSelector, useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';

const SearchBox = () => {
  const dispatch = useDispatch();
  const { setSearchText } = sidebarMenuSlice.actions;
  const searchText = useSelector((state) => state.sidebarItems.searchText);
  const { RVGlobal, RVDic } = useWindow();

  //! Calls on every change that happens at input value
  //! ...and updates redux state.
  const handleChange = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  //! Clears search text when user clicks on cancel icon.
  const handleClearSearchText = (e) => {
    dispatch(setSearchText(''));
  };

  //! Check if user in typing or not.
  const isTyping = !!searchText.length;

  const isSaas = RVGlobal?.SAASBasedMultiTenancy;

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
        onClick={handleClearSearchText}>
        <CancelIcon />
      </Styled.CancelIconWrapper>
      <Styled.SearchInput
        text={SearchPlaceholder}
        onChange={handleChange}
        value={searchText}
        isTyping={isTyping}
      />
      <Styled.FilterIconWrapper>
        <FilterIcon />
      </Styled.FilterIconWrapper>
    </Styled.SearchWrapper>
  );
};

export default SearchBox;
