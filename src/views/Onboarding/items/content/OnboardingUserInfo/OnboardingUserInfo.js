import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginSlice } from 'store/reducers/loginReducer';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import AvatarImageCropper from 'components/ImageCropper/AvatarImageCropper';
import * as AvatarSVGS from 'assets/images/avatars/AvatarProfileAssets';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingUserInfo.styles';
import * as GlobalStyles from 'views/Onboarding/items/Onboarding.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import {
  setUserAvatar,
  setUserFirstAndLastName,
} from 'apiHelper/ApiHandlers/usersApi';
import { ONBOARDING_USER_TEAM_PATH } from 'views/Onboarding/items/others/constants';

const { setAuthUser } = loginSlice.actions;

const OnboardingUserInfoContent = () => {
  const currentUser = useSelector((state) => state.auth.authUser);

  const [isLoading, setIsLoading] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState({
    FirstName: decodeBase64(currentUser.FirstName),
    LastName: decodeBase64(currentUser.LastName),
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const { RVDic } = useWindow();

  //! RVDic i18n localization
  const RVDicFirstName = RVDic.FirstName;
  const RVDicLastName = RVDic.LastName;
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  const RVDicDefaultAvatars = RVDic.DefaultN.replace('[n]', RVDic.Avatar);
  const RVDicPageDescriptionInfo = RVDic._HelpPersonalInfo;

  const isUserInfoSupplied = useMemo(() => {
    const { FirstName, LastName } = currentUserInfo;
    if (String(FirstName).length && String(LastName).length) return true;
    else return false;
  }, [currentUserInfo]);

  const updateUserInfo = (newInfo) => {
    setCurrentUserInfo((state) => {
      const updatedUserInfo = { ...state, ...newInfo };
      dispatch(
        setAuthUser({
          ...currentUser,
          FirstName: encodeBase64(updatedUserInfo.FirstName),
          LastName: encodeBase64(updatedUserInfo.LastName),
        })
      );
      return updatedUserInfo;
    });
  };

  const onImageUpload = (newImageURL) => {
    dispatch(
      setAuthUser({
        ...currentUser,
        ProfileImageURL: newImageURL,
      })
    );
  };

  const setAvatarApi = async ({ avatarName, avatarSrc }) => {
    return setUserAvatar({ Name: avatarName });
  };

  const saveCurrentUserInfo = useMemo(
    () => async () => {
      setIsLoading(true);
      await setUserFirstAndLastName(currentUserInfo);
      history.push(ONBOARDING_USER_TEAM_PATH);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUserInfo]
  );

  return (
    <GlobalStyles.OnboardingFixedLayout>
      <GlobalStyles.OnboardingCenterizeContent>
        <Styles.OnboardingUserInfoDescriptionWrapper>
          <p>{RVDicPageDescriptionInfo}</p>
        </Styles.OnboardingUserInfoDescriptionWrapper>
        <AvatarImageCropper
          avatarObject={AvatarSVGS}
          avatarTabLabel={RVDicDefaultAvatars}
          uploadType="ProfileImage"
          uploadId={currentUser.UserID}
          currentImageURL={currentUser.ProfileImageURL}
          currentAvatarID={decodeBase64(currentUser.AvatarName)}
          setAvatarApi={setAvatarApi}
          onComplete={onImageUpload}
        />

        <Styles.OnboardingUserInfoInputContainer>
          <Styles.OnboardingUserInfoInputWrapper>
            <AnimatedInput
              value={currentUserInfo.FirstName}
              onChange={(inputValue) =>
                updateUserInfo({ FirstName: inputValue })
              }
              placeholder={RVDicFirstName}
            />
          </Styles.OnboardingUserInfoInputWrapper>
          <Styles.OnboardingUserInfoInputWrapper>
            <AnimatedInput
              value={currentUserInfo.LastName}
              onChange={(inputValue) =>
                updateUserInfo({ LastName: inputValue })
              }
              placeholder={RVDicLastName}
            />
          </Styles.OnboardingUserInfoInputWrapper>
          <Styles.OnboardingUserInfoActionButtonWrapper>
            <Button
              onClick={saveCurrentUserInfo}
              disable={!isUserInfoSupplied}
              loading={isLoading}
            >
              {RVDicSaveAndNext}
            </Button>
          </Styles.OnboardingUserInfoActionButtonWrapper>
        </Styles.OnboardingUserInfoInputContainer>
      </GlobalStyles.OnboardingCenterizeContent>
    </GlobalStyles.OnboardingFixedLayout>
  );
};

OnboardingUserInfoContent.displayName = 'OnboardingUserInfoContent';
export default OnboardingUserInfoContent;
