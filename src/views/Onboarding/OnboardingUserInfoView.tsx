import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import OnboardingUserInfoContent from './items/content/OnboardingUserInfo/OnboardingUserInfo';

const OnboardingUserInfoView = (): JSX.Element => {
  const dispatch = useDispatch();

  const { actions: themeActions } = useThemeSlice();

  useEffect(() => {
    dispatch(themeActions.setSidebarVisibility('hidden'));
    return () => {
      dispatch(themeActions.setSidebarVisibility(''));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <OnboardingUserInfoContent />
    </>
  );
};

export default OnboardingUserInfoView;
