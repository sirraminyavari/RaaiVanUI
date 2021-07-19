import { API_Provider } from 'helpers/helpers';
import {
  GET_NOTIFS_COUNT,
  NOTIFICATIONS_API,
  GET_NOTIFS_LIST,
  SET_NOTIFS_AS_SEEN,
  REMOVE_NOTIFICATION,
} from 'constant/apiConstants';
import { notificationsSlice } from 'store/reducers/notificationsReducer';

const {
  setNotificationsCount,
  setNotificationsList,
} = notificationsSlice.actions;

const getNotificationsCountAPI = API_Provider(
  NOTIFICATIONS_API,
  GET_NOTIFS_COUNT
);
const getNotificationsListAPI = API_Provider(
  NOTIFICATIONS_API,
  GET_NOTIFS_LIST
);
const setNotificationsAsSeenAPI = API_Provider(
  NOTIFICATIONS_API,
  SET_NOTIFS_AS_SEEN
);
const removeNotificationAPI = API_Provider(
  NOTIFICATIONS_API,
  REMOVE_NOTIFICATION
);

/**
 * @description A function (action) that gets notifications count.
 * @returns -Dispatch to redux store.
 */
export const getNotificationsCount = () => async (dispatch) => {
  try {
    getNotificationsCountAPI.fetch(
      {},
      (response) => {
        // console.log(response);
        dispatch(setNotificationsCount(+(response || {}).Count));
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that gets notifications list.
 * @returns -Dispatch to redux store.
 */
export const getNotificationsList = () => async (dispatch) => {
  try {
    getNotificationsListAPI.fetch(
      { Count: 45 },
      (response) => {
        // console.log(response);
        dispatch(setNotificationsList((response || {}).Notifications));
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that removes a notification.
 * @returns -Dispatch to redux store.
 */
export const removeNotification = (notifId, done, error) => async (
  dispatch
) => {
  try {
    removeNotificationAPI.fetch(
      { NotificationID: notifId },
      (response) => {
        // console.log(response);
        if (!!(response || {}).Succeed) {
          done && done(notifId);
          dispatch(getNotificationsCount());
          dispatch(getNotificationsList());
        } else if ((response || {}).ErrorText) {
          error && error(response.ErrorText);
        }
      },
      (err) => {
        error && error(err);
      }
    );
  } catch (err) {
    error && error(err);
  }
};

/**
 * @description A function (action) that changes notifications status to seen.
 * @returns -Dispatch to redux store.
 */
export const setNotificationsAsSeen = (notifIds) => async (dispatch) => {
  try {
    setNotificationsAsSeenAPI.fetch(
      { NotificationIDs: notifIds.join('|') },
      (response) => {
        // console.log(response);
        dispatch(getNotificationsCount());
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
