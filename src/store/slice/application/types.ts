interface ISelectingApp {
  isSelecting: boolean;
  selectingAppId: string | null;
}

export interface IApplicationState {
  userApps: any[];
  userArchivedApps: any[];
  isFetching: boolean;
  selectingApp: ISelectingApp;
  currentApp: any;
}

export const EmptyApplicationState: IApplicationState = {
  userApps: [],
  userArchivedApps: [],
  isFetching: false,
  selectingApp: { isSelecting: false, selectingAppId: null },
  currentApp: null,
};
