import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import NotificationsHeader from './NotificationsHeader';
import NotificationItem from './NotificationItem';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import usePreventScroll from 'hooks/usePreventScroll';
import { useNotificationsSlice } from 'store/slice/notification';
import { selectNotifications } from 'store/slice/notification/selectors';

const NotificationsMenu = () => {
  const dispatch = useDispatch();
  const containerRef = useRef();

  const {
    notificationsList: notifications,
    isFetchingNotifsList: isFetchingNotifs,
  } = useSelector(selectNotifications);

  const [fetchCount, setFetchCount] = useState(10);

  const { actions: notificationActions } = useNotificationsSlice();

  usePreventScroll(containerRef);

  const isUnseen = (notif) => notif?.Seen === false;
  const unseenNotifs = notifications?.filter(isUnseen);

  const handleReachEnd = () => {
    const hasUnseenNotifs = !!unseenNotifs?.length;
    const unseenNotifsId = unseenNotifs?.map((notif) => notif?.NotificationID);
    if (hasUnseenNotifs) {
      dispatch(
        notificationActions.setNotificationsAsSeen({
          NotificationIDs: unseenNotifsId,
        })
      );
    }
    if (isFetchingNotifs) return;
    if (notifications.length < fetchCount) return;
    setFetchCount((c) => c + 10);
  };

  useEffect(() => {
    dispatch(notificationActions.getNotificationsCount());
    dispatch(notificationActions.getNotifications({ Count: fetchCount }));
  }, [dispatch, fetchCount]);

  return (
    <Styled.NotificationsMenuContainer ref={containerRef}>
      {notifications?.length ? (
        <>
          <NotificationsHeader unseenCount={unseenNotifs?.length} />
          <ScrollBarProvider
            style={{ maxHeight: '16.5rem', padding: '0 1rem' }}
            onYReachEnd={handleReachEnd}
          >
            {notifications?.map((notif) => {
              return (
                <NotificationItem notif={notif} key={notif?.NotificationID} />
              );
            })}
            <div style={{ textAlign: 'center' }}>
              {isFetchingNotifs && <LoadingIconFlat />}
            </div>
          </ScrollBarProvider>
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
