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

export interface IGetDashboardResponse {
  TotalCount: number;
  Items: {
    ActionDate: string;
    DashboardID: string;
    Done: boolean;
    ExpirationDate: string;
    Info: string;
    NodeID: string;
    NodeAdditionalID: string;
    NodeName: string;
    Name?: string;
    NodeType: string;
    Removable: boolean;
    Seen: boolean;
    SendDate: string;
    SenderUserID: string;
    SubType: string;
    Type: 'Knowledge' | 'MembershipRequest' | 'WorkFlow';
    UserID: string;
    ViewDate: string;
  }[];
}
export const GetDashboards = (properties: {
  NodeTypeID?: string;
  Type?: 'Knowledge' | 'MembershipRequest' | 'WorkFlow';
  Done?: boolean;
  LowerBoundary?: number;
  Count?: number;
  SubType?: string;
  SubTypeTitle?: string;
  DistinctItems?: boolean;
  InWorkFlow?: boolean;
}) => {
  return apiCallWrapper<IGetDashboardResponse>(
    API_Provider(NOTIFICATIONS_API, 'GetDashboards'),
    properties
  );
};

export interface IGetDashboardsCountItems {
  DateOfEffect: string;
  DateOfEffect_Jalali: string;
  Done: number;
  DoneAndInWorkFlow: number;
  DoneAndNotInWorkFlow: number;
  NodeType: string;
  NodeTypeID: string;
  NotSeen: number;
  Sub: IGetDashboardsCountItems[];
  SubType: string;
  SubTypeTitle: string;
  ToBeDone: number;
  IconURL?: string;
  Type: 'Knowledge' | 'MembershipRequest' | 'WorkFlow';
}
export const GetDashboardsCount = () => {
  return apiCallWrapper<{
    AppID: string;
    Done: number;
    DoneAndInWorkFlow: number;
    DoneAndNotInWorkFlow: number;
    NotSeen: number;
    ToBeDone: number;
    Items: IGetDashboardsCountItems[];
  }>(API_Provider(NOTIFICATIONS_API, 'GetDashboardsCount'));
};
