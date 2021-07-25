import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import NotificationsHeader from './NotificationsHeader';
import NotificationItem from './NotificationItem';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import {
  getNotificationsCount,
  getNotificationsList,
  setNotificationsAsSeen,
} from 'store/actions/global/NotificationActions';

const selectNotificatios = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.notificationsList
);

const selectIsFetchingNotifs = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.isFetchingNotifsList
);

const NotificationsMenu = () => {
  const dispatch = useDispatch();
  const containerRef = useRef();
  const notifications = useSelector(selectNotificatios);
  const isFetchingNotifs = useSelector(selectIsFetchingNotifs);
  const [fetchCount, setFetchCount] = useState(10);

  const isUnseen = (notif) => notif?.Seen === false;
  const unseenNotifs = notifications?.filter(isUnseen);

  const handleReachEnd = () => {
    const hasUnseenNotifs = !!unseenNotifs?.length;
    const unseenNotifsId = unseenNotifs?.map((notif) => notif?.NotificationID);
    if (hasUnseenNotifs) {
      dispatch(setNotificationsAsSeen(unseenNotifsId));
    }
    if (isFetchingNotifs) return;
    if (notifications.length < fetchCount) return;
    setFetchCount((c) => c + 10);
  };

  useEffect(() => {
    dispatch(getNotificationsCount());
    dispatch(getNotificationsList(fetchCount));
  }, [dispatch, fetchCount]);

  useLayoutEffect(() => {
    const containerNode = containerRef.current;
    const preventScroll = (e) => e.preventDefault();
    containerNode.addEventListener('mousewheel', preventScroll);

    //! Clean up
    return () => {
      containerNode.removeEventListener('mousewheel', preventScroll);
    };
  }, []);

  return (
    <Styled.NotificationsMenuContainer ref={containerRef}>
      {notifications?.length ? (
        <>
          <NotificationsHeader unseenCount={unseenNotifs?.length} />
          <PerfectScrollbar
            onYReachEnd={handleReachEnd}
            className="notifs-scroll-area">
            {notifications?.map((notif) => {
              return (
                <NotificationItem notif={notif} key={notif?.NotificationID} />
              );
            })}
            <div style={{ textAlign: 'center' }}>
              {isFetchingNotifs && <LoadingIconFlat />}
            </div>
          </PerfectScrollbar>
        </>
      ) : (
        <Styled.EmptyNotifs>
          در حال حاضر اعلانی برای خواندن وجود ندارد
        </Styled.EmptyNotifs>
      )}
    </Styled.NotificationsMenuContainer>
  );
};

export default NotificationsMenu;
