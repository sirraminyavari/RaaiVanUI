import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import OnboardingTeamContent from './items/content/OnboardingTeam/OnboardingTeam';
const { setSidebarVisibility } = themeSlice.actions;

const OnboardingTeamView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarVisibility('hidden'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <OnboardingTeamContent />
    </>
  );
};

export default OnboardingTeamView;
