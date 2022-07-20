import { FC, ReactNode } from 'react';

export interface ITabViewChildrenProps {
  type: 'Item' | 'Action';
  children?: ReactNode;
}

export interface ITabViewItemProps extends ITabViewChildrenProps {
  label: string;
}
/**
 * @description
 * @param {number} height: ;
 */
export interface ITabviewProps {
  height?: number;
  onSelect?: (key: string) => void;
  children?: ReactNode;
}

export interface TabViewSub {
  Item: TabViewItem;
  Action: TabViewAction;
}
export declare const TabViewItem: FC<ITabViewItemProps>;

export declare const TabViewAction: FC<ITabViewChildrenProps>;

export declare const TabView: FC<ITabviewProps> & TabViewSub;
