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
  data: ITreeModel;
  onMove?: (id: string, parentId: string) => void;
  onSort?: (ids: Array<strnig>) => void;
  isDragEnabled: boolean;
  isNestingEnabled: boolean;
  offsetPerLevel: number;
  children?: ReactNode;
}

export interface IRVTreeItem {}
/**
 * example
 */

export declare const RVTree = (props: IRVTreeProps) => JSX.Element;
