import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from '../Navbar.styles';
import AlertFooter from './AlertFooter';
import AlertItem from './AlertItem';
import { createSelector } from 'reselect';
import {
  getNotificationsCount,
  getNotificationsList,
  setNotificationsAsSeen,
} from 'store/actions/global/NotificationActions';

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
    const checkUnseen = (notif) => notif.Seen === false;
    const hasUnseenNotifs = slicedNotifs.some(checkUnseen);
    const unseenNotifsId = slicedNotifs
      .filter(checkUnseen)
      .map((notif) => notif.NotificationID);
    if (hasUnseenNotifs) {
      dispatch(setNotificationsAsSeen(unseenNotifsId));
    }
  }, [slicedNotifs, dispatch]);

  return (
    <Styled.AlertActionsContainer>
      {slicedNotifs.length ? (
        <>
          <Styled.AlertListContainer>
            {slicedNotifs?.map((alert) => (
              <AlertItem alert={alert} key={alert.NotificationID} />
            ))}
          </Styled.AlertListContainer>
          <AlertFooter />
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
