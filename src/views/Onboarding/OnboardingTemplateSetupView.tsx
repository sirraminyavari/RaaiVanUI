import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import OnboardingTemplateSetupContent from './items/content/OnboardingTemplateSetup/OnboardingTemplateSetup';

const OnboardingTemplateSetupView = () => {
  const dispatch = useDispatch();

  const { actions: themeActions } = useThemeSlice();

  useEffect(() => {
    dispatch(themeActions.setSidebarVisibility(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <OnboardingTemplateSetupContent />
    </>
  );
};

export default OnboardingTemplateSetupView;
