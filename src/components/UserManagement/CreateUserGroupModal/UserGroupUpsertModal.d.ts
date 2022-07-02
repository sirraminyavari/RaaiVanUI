import { FC } from 'react';

export interface IUserGroupUpsertModalProps {
  group?: any;
  users: Array<any>;
  onConfirm?: (title: string, members: Array<any>, id?: string) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
}

const UserGroupUpsertModal: FC<IUserGroupUpsertModalProps>;
export default UserGroupUpsertModal;
