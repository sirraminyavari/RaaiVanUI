import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import OnboardingIntroductionContent from './items/content/OnboardingIntroduction/OnboardingIntroduction';
const { setSidebarVisibility } = themeSlice.actions;

const OnboardingIntroductionView = (): JSX.Element => {
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
      <OnboardingIntroductionContent />
    </>
  );
};

export default OnboardingIntroductionView;
