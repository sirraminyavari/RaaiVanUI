import { call, put, takeLatest } from 'redux-saga/effects';
import { notificationActions as actions } from '.';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';
import { INotifID } from './types';

function* getNotificationsCount() {
  const res = yield call(API.Notifications.getNotificationsCount);
  yield put(actions.setNotificationsCount(+res?.Count));
}

function* getNotifications(values: PayloadAction<{ Count?: number }>) {
  yield put(actions.setIsFetchingNotifsList(true));
  const res = yield call(API.Notifications.getNotifications, {
    Count: values.payload?.Count,
  });
  yield put(actions.setNotificationsList(res?.Notifications || []));
  yield put(actions.setIsFetchingNotifsList(false));
}

function* removeNotification(values: PayloadAction<INotifID>) {
  const { done, error, NotificationID } = values.payload || {};

  const res = yield call(API.Notifications.removeNotification, {
    NotificationID,
  });

  if (res?.Succeed) {
    yield put(actions.getNotificationsCount());
    yield put(actions.getNotifications({}));
    done && done(NotificationID);
  } else if (res?.ErrorText) error && error(res.ErrorText);
}

function* setNotificationsAsSeen(
  values: PayloadAction<{ NotificationIDs: string[] }>
) {
  const res = yield call(API.Notifications.setNotificationsAsSeen, {
    NotificationIDs: values.payload?.NotificationIDs,
  });

  if (!res?.ErrorText) yield put(actions.getNotificationsCount());
}

export function* notificationsSaga() {
  yield takeLatest(actions.getNotificationsCount.type, getNotificationsCount);
  yield takeLatest(actions.getNotifications.type, getNotifications);
  yield takeLatest(actions.removeNotification.type, removeNotification);
  yield takeLatest(actions.setNotificationsAsSeen.type, setNotificationsAsSeen);
}
