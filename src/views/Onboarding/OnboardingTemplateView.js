import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import OnboardingTemplateContent from './items/content/OnboardingTemplate/OnboardingTemplate';
const { setSidebarVisibility } = themeSlice.actions;

const OnboardingTemplateView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarVisibility('hidden'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <OnboardingTemplateContent />
    </>
  );
};

export default OnboardingTemplateView;
