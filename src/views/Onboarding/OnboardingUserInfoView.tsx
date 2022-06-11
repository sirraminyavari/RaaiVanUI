import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import OnboardingUserInfoContent from './items/content/OnboardingUserInfo/OnboardingUserInfo';
const { setSidebarVisibility } = themeSlice.actions;

const OnboardingUserInfoView = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarVisibility('hidden'));
    return () => {
      dispatch(setSidebarVisibility(''));
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
