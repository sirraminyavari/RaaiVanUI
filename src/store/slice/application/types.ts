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

interface IRequest {
  done?: (res?: any) => any;
  error?: (err?: string) => any;
}

interface IAppID extends IRequest {
  ApplicationID: string;
}

interface IWorkspaceIDTitle extends IRequest {
  WorkspaceID: string;
  Title: string;
}

interface IAppIDTitle extends IRequest {
  ApplicationID: string;
  Title: string;
}

interface IAppIDUserID extends IRequest {
  ApplicationID: string;
  UserID: string;
}

interface IAppIDs extends IRequest {
  ApplicationIDs: string[];
}

export type { IAppID, IWorkspaceIDTitle, IAppIDTitle, IAppIDUserID, IAppIDs };
