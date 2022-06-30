import { FC, ReactNode } from 'react';

export interface ICheckboxLabelProps {
  src?: string;
  title?: string;
  children?: ReactNode;
}

export interface ICheckboxProps {
  checked?: boolean;
  value?: string;
  onChange?: (e?: any) => void;
  children?: ReactNode;
}

export const CheckboxLabel: FC<ICheckboxLabelProps>;

export interface ICheckboxSub {
  Label: CheckboxLabel;
}

const RVCheckbox: FC<IUserSelectionCheckboxProps> & IUserSelectionCheckboxSub;
export default RVCheckbox;
