import * as AvatarSVGS from 'assets/images/avatars/AvatarProfileAssets';
import { avatarIconURL } from 'helpers/helpers';

/**
 * @component - A HOC component converting base64 encoded AvatarName and ImageURL properties and injecting an Avatar URL or the profile image URL as a desired prop argument to passed component
 *
 * @param {string} props.componentURLProp - The component's URL receiving property name (e.g. "src" is receiving property name for <img/> html tag)
 * @param {JSX.Element} props.Component - The component that needs an URL for displaying an Avatar or Image
 * @param {object} [props.AvatarSVGsObject] - An Object the of Avatar URLs and Names.
 * @return {JSX.Element}
 * @example
 * ```jsx
 * import * as AvatarSVGS from 'assets/images/avatars/AvatarProfileAssets';
 * import AvatarComponent from 'components/Avatar/Avatar';
 * import WithAvatar from 'components/Avatar/WithAvatar';
 *
 *const Avatar = WithAvatar({Component:AvatarComponent, componentURLProp:'userImage',AvatarSVGsObject:AvatarSVGS});
 * ...
 *
 * //* pass user object containing "ImageURL" and "AvatarName" to the "userObject" attribute
 * <Avatar  userObject={window.RVGlobal.CurrentUser} {...restProps}/>
 *
 * ```
 */

const WithAvatar =
  ({ Component, componentURLProp, AvatarSVGsObject = AvatarSVGS }) =>
  (props) => {
    const { userObject, [componentURLProp]: urlProp, ...rest } = props;

    const newProps = {
      ...rest,
      [componentURLProp]: avatarIconURL({
        userObject,
        defaultURL: urlProp,
        AvatarSVGsObject,
      }),
    };

    return (
      <>
        <Component {...newProps} />
      </>
    );
  };

WithAvatar.displayName = 'WithAvatar';

export default WithAvatar;
