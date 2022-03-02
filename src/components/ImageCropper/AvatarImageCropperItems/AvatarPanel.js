import { useEffect, useRef, useState } from 'react';
import * as Styles from './AvatarImageCropper.styles';

/**
 * @component
 * @param {string[]} props.avatars
 * @param {Record<string,string>} props.avatarObject
 * @return {JSX.Element}
 */
function AvatarPanels({ onChange, value, avatarObject }) {
  const isLoaded = useRef(false);
  const [avatar, setAvatar] = useState({ avatarName: value });

  useEffect(() => {
    if (isLoaded.current) onChange(avatar);
    else isLoaded.current = true;
    console.log(avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar]);

  //TODO This component needs improvements regarding how to get different set of avatar pictures

  return (
    <>
      <Styles.ImageCropperAvatarContainer
        active={avatar.avatarName !== undefined}
      >
        {Object.entries(avatarObject).map(([avatarName, avatarSrc]) => {
          return (
            <Styles.ImageCropperAvatarImageButton
              key={avatarSrc}
              active={avatar.avatarName === avatarName}
              onClick={() => setAvatar({ avatarName, avatarSrc })}
            >
              <Styles.ImageCropperAvatarImage src={avatarSrc} />
            </Styles.ImageCropperAvatarImageButton>
          );
        })}
      </Styles.ImageCropperAvatarContainer>
    </>
  );
}

AvatarPanels.displayName = 'AvatarPanels';

export default AvatarPanels;
