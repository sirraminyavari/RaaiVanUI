import { IReduxActionCall } from '../types';

export interface IApplicationState {
  userApps: any[];
  userArchivedApps: any[];
  isFetching: boolean;
  selectingApp: {
    isSelecting: boolean;
    selectingAppId: string | null;
  };
  currentApp: any;
}

export const EmptyApplicationState: IApplicationState = {
  userApps: [],
  userArchivedApps: [],
  isFetching: false,
  selectingApp: { isSelecting: false, selectingAppId: null },
  currentApp: null,
};

interface IAppID extends IReduxActionCall {
  ApplicationID: string;
}

interface IAppIDUserID extends IReduxActionCall {
  ApplicationID: string;
  UserID: string;
}

export type { IAppID, IAppIDUserID };
