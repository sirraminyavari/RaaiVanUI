import { useEffect, useRef, useState } from 'react';
import * as Styles from './AvatarImageCropper.styles';
import * as AvatarSVGS from 'assets/images/avatars/AvatarAssets-profile';

/**
 * @component
 * @param {string[]} props.avatars
 * @return {JSX.Element}
 */
function AvatarButtons({ onChange, value }) {
  const isLoaded = useRef(false);
  const [activeAvatar, setActiveAvatar] = useState(value);

  useEffect(() => {
    if (isLoaded.current) onChange(activeAvatar);
    else isLoaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAvatar]);

  //TODO This component needs improvements regarding how to get different set of avatar pictures

  return (
    <>
      <Styles.ImageCropperAvatarContainer active={activeAvatar !== undefined}>
        {Object.values(AvatarSVGS).map((avatarSrc) => {
          return (
            <Styles.ImageCropperAvatarImageButton
              key={avatarSrc}
              active={activeAvatar === avatarSrc}
              onClick={() => setActiveAvatar(avatarSrc)}
            >
              <Styles.ImageCropperAvatarImage src={avatarSrc} />
            </Styles.ImageCropperAvatarImageButton>
          );
        })}
      </Styles.ImageCropperAvatarContainer>
    </>
  );
}

AvatarButtons.displayName = 'AvatarButtons';

export default AvatarButtons;
