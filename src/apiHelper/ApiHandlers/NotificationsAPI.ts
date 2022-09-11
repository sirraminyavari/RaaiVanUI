import { NOTIFICATIONS_API } from 'constant/apiConstants';
import { API_Provider } from 'helpers/helpers';
import { apiCallWrapper } from './apiCallHelpers';

export const getNotificationsCount = () => {
  return apiCallWrapper(
    API_Provider(NOTIFICATIONS_API, 'GetNotificationsCount'),
    {}
  );
};

export const getNotifications = ({ Count }: { Count?: number } = {}) => {
  return apiCallWrapper(API_Provider(NOTIFICATIONS_API, 'GetNotifications'), {
    Count,
  });
};

export const removeNotification = ({
  NotificationID,
}: {
  NotificationID: string;
}) => {
  return apiCallWrapper(API_Provider(NOTIFICATIONS_API, 'RemoveNotification'), {
    NotificationID,
  });
};

export const setNotificationsAsSeen = ({
  NotificationIDs,
}: {
  NotificationIDs: string[];
}) => {
  return apiCallWrapper(
    API_Provider(NOTIFICATIONS_API, 'SetNotificationsAsSeen'),
    {
      NotificationIDs: NotificationIDs.join('|'),
    }
  );
};

export const GetDashboards = (properties: {
  NodeTypeID?: string;
  Type?: 'WorkFlow';
  Done?: boolean;
  LowerBoundary?: number;
  Count?: number;
}) => {
  return apiCallWrapper(
    API_Provider(NOTIFICATIONS_API, 'GetDashboards'),
    properties
  );
};

export const GetDashboardsCount = () => {
  return apiCallWrapper<any>(
    API_Provider(NOTIFICATIONS_API, 'GetDashboardsCount')
  );
};
