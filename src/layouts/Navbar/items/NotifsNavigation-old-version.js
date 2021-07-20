import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import ArrowHead from 'components/Icons/ArrowIcons/ArrowHead';
import { notificationsSlice } from 'store/reducers/notificationsReducer';
import { CV_DISTANT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';

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

const NotifsNavigationOldVersion = () => {
  const dispatch = useDispatch();

  const { RV_Float, RV_RevFloat, RVDic } = useWindow();
  const currentPage = useSelector(selectCurrentPage);
  const isFirstPage = useSelector(selectIsFirstPage);
  const isLastPage = useSelector(selectIsLastPage);
  const totalPage = useSelector(selectTotalPage);
  const { setNextPage, setPrevPage } = notificationsSlice.actions;

  //! Sets next alert page.
  const handleNextPage = () => {
    dispatch(setNextPage());
  };

  //! Sets previous alert page.
  const handlePrevPage = () => {
    dispatch(setPrevPage());
  };

  return (
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
  );
};

export default NotifsNavigationOldVersion;
