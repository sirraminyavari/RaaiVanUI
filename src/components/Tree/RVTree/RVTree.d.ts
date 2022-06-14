import { ReactNode } from 'react';

export interface ITreeItem {
  id: string;
  children: Array<string>;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isChildrenLoading?: boolean;
  data?: any;
}

export interface ITreeModel {
  rootId: string;
  items: { [string]: ITreeItem };
}

export interface IRVTreeProps {
  tree: ITreeModel;
  onMove?: (id: string, parentId: string) => void;
  onSort?: (ids: Array<strnig>) => void;
  children?: ReactNode;
}

export interface IRVTreeItem {}
/**
 * example
 */

export declare const RVTree = (props: IRVTreeProps) => JSX.Element;
