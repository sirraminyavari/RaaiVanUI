import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import NotificationsFooter from './NotificationsFooter';
import NotificationItem from './NotificationItem';
import {
  getNotificationsCount,
  getNotificationsList,
  setNotificationsAsSeen,
} from 'store/actions/global/NotificationActions';
import { notificationsSlice } from 'store/reducers/notificationsReducer';

const { setPrevPage } = notificationsSlice.actions;

const selectNotificatios = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.notificationsList
);

const selectOffset = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.offset
);

const selectPerPage = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.perPage
);

const AlertActions = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotificatios);
  const offset = useSelector(selectOffset);
  const perPage = useSelector(selectPerPage);

  //! Chunks alerts list based on current page and per page values.
  const slicedNotifs = notifications.slice(offset, offset + perPage);

  useEffect(() => {
    dispatch(getNotificationsCount());
    dispatch(getNotificationsList());
  }, [dispatch]);

  useEffect(() => {
    const isUnseen = (notif) => notif?.Seen === false;
    const hasUnseenNotifs = slicedNotifs?.some(isUnseen);
    const unseenNotifsId = slicedNotifs
      .filter(isUnseen)
      .map((notif) => notif?.NotificationID);
    if (hasUnseenNotifs) {
      dispatch(setNotificationsAsSeen(unseenNotifsId));
    }
    if (slicedNotifs?.length === 0) {
      dispatch(setPrevPage());
    }
  }, [slicedNotifs, dispatch]);

  return (
    <Styled.AlertActionsContainer>
      {notifications?.length ? (
        <>
          <Styled.AlertListContainer>
            {slicedNotifs?.map((alert) => (
              <NotificationItem alert={alert} key={alert?.NotificationID} />
            ))}
          </Styled.AlertListContainer>
          <NotificationsFooter />
        </>
      ) : (
        <Styled.EmptyAlert>
          در حال حاضر اعلانی برای خواندن وجود ندارد
        </Styled.EmptyAlert>
      )}
    </Styled.AlertActionsContainer>
  );
};

export default AlertActions;
