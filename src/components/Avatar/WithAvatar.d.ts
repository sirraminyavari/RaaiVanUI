import { FunctionComponent } from 'react';

export interface IWithAvatar {
  componentURLProp?: string;
  Component?: FunctionComponent<Record<string | 'src', any>>;
  AvatarSVGObject?: Record<string, string>;
}

declare const WithAvatar: (
  IWithAvatar
) => FunctionComponent<Record<string, any>>;

export default WithAvatar;
