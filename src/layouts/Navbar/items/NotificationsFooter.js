import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Navbar/Navbar.styles';
// import CheckIcon from 'components/Icons/CheckIcons/DoubleCheck';
import ArrowHead from 'components/Icons/ArrowIcons/ArrowHead';
import { notificationsSlice } from 'store/reducers/notificationsReducer';
import useWindow from 'hooks/useWindowContext';
import { CV_DISTANT } from 'constant/CssVariables';

const selectCurrentPage = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.currentPage
);

const selectTotalPage = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.totalPage
);

const selectIsFirstPage = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.isFirstPage
);

const selectIsLastPage = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.isLastPage
);

/**
 * Renders a footer component for alerts menu.
 */
const AlertFooter = () => {
  const dispatch = useDispatch();
  const { RV_Float, RV_RevFloat, RVDic } = useWindow();
  const currentPage = useSelector(selectCurrentPage);
  const isFirstPage = useSelector(selectIsFirstPage);
  const isLastPage = useSelector(selectIsLastPage);
  const totalPage = useSelector(selectTotalPage);
  const { setNextPage, setPrevPage, setReadAll } = notificationsSlice.actions;

  //! Marks all alerts as read.
  const handleReadAll = () => {
    dispatch(setReadAll());
  };

  //! Sets next alert page.
  const handleNextPage = () => {
    dispatch(setNextPage());
  };

  //! Sets previous alert page.
  const handlePrevPage = () => {
    dispatch(setPrevPage());
  };

  return (
    <Styled.AlertFooterContainer>
      {/* <Styled.AlertFooterCheckWrapper onClick={handleReadAll}>
        <CheckIcon size={20} />
        <span style={{ margin: '0.2rem' }}>خوانده شدن همه</span>
      </Styled.AlertFooterCheckWrapper> */}
      <Styled.AlertFooterNavigation>
        <Styled.AlertFooterArrowWrapper
          style={{ color: isLastPage && `${CV_DISTANT}` }}
          onClick={handleNextPage}>
          <ArrowHead dir={RV_Float} size={20} />
        </Styled.AlertFooterArrowWrapper>
        <Styled.AlertFooterArrowWrapper style={{ padding: '0 0.5rem' }}>
          {`${currentPage + 1} ${RVDic.Of} ${totalPage}`}
        </Styled.AlertFooterArrowWrapper>
        <Styled.AlertFooterArrowWrapper
          style={{ color: isFirstPage && `${CV_DISTANT}` }}
          onClick={handlePrevPage}>
          <ArrowHead dir={RV_RevFloat} size={20} />
        </Styled.AlertFooterArrowWrapper>
      </Styled.AlertFooterNavigation>
    </Styled.AlertFooterContainer>
  );
};

export default AlertFooter;
