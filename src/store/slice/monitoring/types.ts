export interface IMonitoringState {
  totalUsersCount: number;
  membersCount: number;
  lastActivityTime: string;
  loginsCountSinceNDaysAgo: number;
  count: number;
  lowerBoundary: number;
  monitoring: any;
  isFetching: boolean;
}

export const EmptyMonitoringState: IMonitoringState = {
  totalUsersCount: 0,
  membersCount: 0,
  lastActivityTime: '',
  loginsCountSinceNDaysAgo: 30,
  count: 20,
  lowerBoundary: 1,
  monitoring: {},
  isFetching: false,
};
