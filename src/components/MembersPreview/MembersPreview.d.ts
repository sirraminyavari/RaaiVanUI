import { FC } from 'react';

export interface IMemberPreviewProps {
  members: Array<any>;
  maxItems: number;
  size: number;
  showMore: boolean;
}

declare const MembersPreview: FC<IMembersPreviewProps>;
export default MembersPreview;
