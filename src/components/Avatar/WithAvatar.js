import * as AvatarSVGS from 'assets/images/avatars/AvatarProfileAssets';
import { decodeBase64 } from 'helpers/helpers';

/**
 * @component - A HOC component converting base64 encoded AvatarName and ImageURL properties and injecting an Avatar URL or the profile image URL as a desired prop argument to passed component
 *
 * @param {string} props.componentURLProp - The component's URL receiving property name (e.g. "src" is receiving property name for <img/> html tag)
 * @param {number} [props.Component] - The component that needs an URL for displaying an Avatar or Image
 * @param {object} [props.AvatarSVGsObject] - An Object the of Avatar URLs and Names.
 * @return {JSX.Element}
 * @example
 * ```jsx
 * import * as AvatarSVGS from 'assets/images/avatars/AvatarProfileAssets';
 * import AvatarComponent from 'components/Avatar/Avatar';
 * import WithAvatar from 'components/Avatar/WithAvatar';
 *
 *const Avatar = WithAvatar({AvatarComponent, 'userImage',AvatarSVGS});
 * ...
 *
 *
 * <Avatar  AvatarSVGsObject={window.RVGlobal.CurrentUser} {...restProps}/>
 *
 * ```
 */

const WithAvatar =
  ({ Component, componentURLProp, AvatarSVGsObject = AvatarSVGS }) =>
  (props) => {
    const { userObject, [componentURLProp]: urlProp, ...rest } = props;

    const AvatarOrImageSrc = (userObject) => {
      const { ImageURL, AvatarName } = userObject || {};
      if (AvatarName) {
        if (AvatarName && AvatarSVGsObject[decodeBase64(AvatarName)])
          return AvatarSVGsObject[decodeBase64(AvatarName)];
        else return urlProp;
      } else if (ImageURL) return ImageURL;
      else return urlProp;
    };

    const newProps = {
      ...rest,
      [componentURLProp]: AvatarOrImageSrc(userObject),
    };

    return (
      <>
        <Component {...newProps} />
      </>
    );
  };

WithAvatar.displayName = 'WithAvatar';

export default WithAvatar;
