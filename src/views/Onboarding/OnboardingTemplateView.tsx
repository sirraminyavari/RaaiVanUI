import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import OnboardingTemplateContent from './items/content/OnboardingTemplate/OnboardingTemplate';

const OnboardingTemplateView = () => {
  const dispatch = useDispatch();

  const { actions: themeActions } = useThemeSlice();

  useEffect(() => {
    dispatch(themeActions.setSidebarVisibility('hidden'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <OnboardingTemplateContent />
    </>
  );
};

export default OnboardingTemplateView;
