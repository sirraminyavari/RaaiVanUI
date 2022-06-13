import { ReactNode } from 'react';

/**
 * Tab view props
 * @interface ITabViewProps
 * @property {number} Tab selection row height in rem
 * @property {event} Tab selection row height in rem
 *
 */
export interface ITabViewProps {
  height: number;
  onSelect: (key: stirng) => void;
  children?: ReactNode;
  type: 'Item' | 'Action';
  key?: string;
}

export declare const TabView = (props: ITabViewProps) => JSX.Element;
