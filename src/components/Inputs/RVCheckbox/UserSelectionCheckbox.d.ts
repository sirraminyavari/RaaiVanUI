import { FC, ReactNode } from 'react';

export interface IUserSelectionCheckboxLabelProps {
  src?: string;
  title?: string;
  children?: ReactNode;
}

export interface IUserSelectionCheckboxProps {
  checked?: boolean;
  value?: any;
  onChange?: (e?: any) => void;
  children?: ReactNode;
}

export const UserSelectCheckboxLable: FC<IUserSelectionCheckboxLabelProps>;

export interface IUserSelectionCheckboxSub {
  Label: UserSelectCheckboxLable;
}

const UserSlectionCheckbox: FC<IUserSelectionCheckboxProps> &
  IUserSelectionCheckboxSub;
export default UserSlectionCheckbox;
