import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import OnboardingTemplateSetupContent from './items/content/OnboardingTemplateSetup/OnboardingTemplateSetup';
const { setSidebarVisibility } = themeSlice.actions;

const OnboardingTemplateSetupView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarVisibility(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <OnboardingTemplateSetupContent />
    </>
  );
};

export default OnboardingTemplateSetupView;
