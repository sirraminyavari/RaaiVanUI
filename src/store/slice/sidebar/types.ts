import { IReduxActionCall } from '../types';

export interface ISidebarState {
  nodeTypes: any[];
  tree: any[];
  dndTree: { [x: string]: any };
  openMenuID: any[];
  searchText: string;
  showSearchResults: boolean;
  configPanels: any[];
  underMenuList: any[];
  favoriteNodesCount: number;
}

export const EmptySidebarState: ISidebarState = {
  nodeTypes: [],
  tree: [],
  dndTree: {},
  openMenuID: [],
  searchText: '',
  showSearchResults: false,
  configPanels: [],
  underMenuList: [],
  favoriteNodesCount: 0,
};

interface IRemoveNodeTypeRequest extends IReduxActionCall {
  NodeType: any;
  RemoveHierarchy?: boolean;
}

interface IRecoverNodeTypeRequest {
  NodeTypeID: string;
  ChildrenIDs?: string[];
}

interface IMoveNodeTypeRequest {
  NodeTypeID: string;
  ParentID: string;
}

export type {
  IRemoveNodeTypeRequest,
  IRecoverNodeTypeRequest,
  IMoveNodeTypeRequest,
};
