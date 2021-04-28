import { useDispatch, useSelector } from 'react-redux';
import * as Styled from '../Navbar.styles';
import CheckIcon from 'components/Icons/CheckIcons/DoubleCheck';
import ArrowHead from 'components/Icons/ArrowIcons/ArrowHead';
import { navAlertSlice } from 'store/reducers/navbarAlertReducer';
import { createSelector } from 'reselect';

const selectCurrentPage = createSelector(
  (state) => state.navbarAlert,
  (navbarAlert) => navbarAlert.currentPage
);

const AlertFooter = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const { setNextPage, setPrevPage, setReadAll } = navAlertSlice.actions;

  const handleReadAll = () => {
    console.log('mark all as read');
    dispatch(setReadAll());
  };

  const handleNextPage = () => {
    console.log('next page');
    dispatch(setNextPage());
  };

  const handlePrevPage = () => {
    console.log('previous page');
    dispatch(setPrevPage());
  };

  return (
    <Styled.AlertFooterContainer>
      <Styled.AlertFooterCheckWrapper onClick={handleReadAll}>
        <CheckIcon size={20} />
        <span style={{ margin: '0.2rem' }}>خوانده شدن همه</span>
      </Styled.AlertFooterCheckWrapper>
      <Styled.AlertFooterNavigation>
        <Styled.AlertFooterArrowWrapper onClick={handleNextPage}>
          <ArrowHead size={20} />
        </Styled.AlertFooterArrowWrapper>
        <Styled.AlertFooterArrowWrapper>
          {currentPage + 1}
        </Styled.AlertFooterArrowWrapper>
        <Styled.AlertFooterArrowWrapper onClick={handlePrevPage}>
          <ArrowHead dir="left" size={20} />
        </Styled.AlertFooterArrowWrapper>
      </Styled.AlertFooterNavigation>
    </Styled.AlertFooterContainer>
  );
};

export default AlertFooter;
