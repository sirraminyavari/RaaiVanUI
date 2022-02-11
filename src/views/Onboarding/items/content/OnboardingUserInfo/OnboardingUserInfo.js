import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginSlice } from 'store/reducers/loginReducer';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import ImageCropper from 'components/ImageCropper/ImageCropper';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingUserInfo.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { updateCurrentUserFirstAndLastName } from 'apiHelper/ApiHandlers/usersApi';
import Button from 'components/Buttons/Button';
import { ONBOARDING_USER_TEAM_PATH } from '../../others/constants';

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

  const saveCurrentUserInfo = useMemo(
    () => async () => {
      setIsLoading(true);
      await updateCurrentUserFirstAndLastName(
        currentUserInfo.FirstName,
        currentUserInfo.LastName
      );
      history.push(ONBOARDING_USER_TEAM_PATH);
    },
    [currentUserInfo]
  );

  return (
    <Styles.OnboardingUserInfoWrapper>
      <ImageCropper
        image={currentUser.ProfileImageURL}
        uploadType="ProfileImage"
        cropShape="round"
        uploadId={currentUser.UserID}
        onImageUpload={onImageUpload}
        showGrid={false}
        isEditable
      />
      <Styles.OnboardingUserInfoInputContainer>
        <Styles.OnboardingUserInfoInputWrapper>
          <AnimatedInput
            value={currentUserInfo.FirstName}
            onChange={(inputValue) => updateUserInfo({ FirstName: inputValue })}
            placeholder={RVDicFirstName}
          />
        </Styles.OnboardingUserInfoInputWrapper>
        <Styles.OnboardingUserInfoInputWrapper>
          <AnimatedInput
            value={currentUserInfo.LastName}
            onChange={(inputValue) => updateUserInfo({ LastName: inputValue })}
            placeholder={RVDicLastName}
          />
        </Styles.OnboardingUserInfoInputWrapper>
        <Styles.OnboardingUserInfoActionButtonWrapper>
          <Button onClick={saveCurrentUserInfo} loading={isLoading}>
            {RVDicSaveAndNext}
          </Button>
        </Styles.OnboardingUserInfoActionButtonWrapper>
      </Styles.OnboardingUserInfoInputContainer>
    </Styles.OnboardingUserInfoWrapper>
  );
};

OnboardingUserInfoContent.displayName = 'OnboardingUserInfoContent';
export default OnboardingUserInfoContent;
