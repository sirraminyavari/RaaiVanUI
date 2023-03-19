import React from 'react';

export interface IWithAvatar {
  Component?: any;
  componentURLProp?: any;
  AvatarSVGObject?: any;
}

declare const WithAvatar: React.FC<IWithAvatar>;

export default WithAvatar;
