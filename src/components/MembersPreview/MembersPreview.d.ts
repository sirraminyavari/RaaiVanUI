import { FC } from 'react';

export interface IMemberPreviewProps {
  members: Array<any>;
  maxItems: number;
  size: number;
  showMore: boolean;
}

const MembersPreview: FC<IMembersPreviewProps>;
export default MembersPreview;
