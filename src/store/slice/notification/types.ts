import { IReduxActionCall } from '../types';

export interface INotificationState {
  notificationsList: any[];
  notificationsCount: number;
  isFetchingNotifsList: boolean;
}

export const EmptyNotificationState: INotificationState = {
  notificationsList: [],
  notificationsCount: 0,
  isFetchingNotifsList: false,
};

interface INotifID extends IReduxActionCall {
  NotificationID: string;
}

export type { INotifID };
