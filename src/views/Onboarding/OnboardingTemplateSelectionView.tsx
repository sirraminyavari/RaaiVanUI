import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import OnboardingTemplateSelectionContent from './items/content/OnboardingTemplateSelection/OnboardingTemplateSelection';
const { setSidebarVisibility } = themeSlice.actions;

const OnboardingTemplateSelectionView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarVisibility('hidden'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <OnboardingTemplateSelectionContent />
    </>
  );
};

export default OnboardingTemplateSelectionView;
