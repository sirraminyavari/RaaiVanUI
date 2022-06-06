import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import OnboardingTemplateSelectionContent from './items/content/OnboardingTemplateSelection/OnboardingTemplateSelection';

const OnboardingTemplateSelectionView = () => {
  const dispatch = useDispatch();

  const { actions: themeActions } = useThemeSlice();

  useEffect(() => {
    dispatch(themeActions.setSidebarVisibility('hidden'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <OnboardingTemplateSelectionContent />
    </>
  );
};

export default OnboardingTemplateSelectionView;
