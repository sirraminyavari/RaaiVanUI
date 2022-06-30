import { FC, ReactNode } from 'react';

export interface IModalProps {
  title?: string;
  bobackground?: boolean;
  middle?: boolean;
  stick?: boolean;
  show?: boolean;
  onClose?: () => void;
  contentclass?: string;
  contentWindth?: any;
  titleclass?: string;
  titlecontainerclass?: string;
  prevventparentscroll?: boolean;
  children?: ReactNode;
}

declare const Modal: FC<IModalProps>;

export default Modal;
