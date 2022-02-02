import WorkspaceDeleteContent from './items/sides/content/WorkspaceDeleteContent';
import WorkspaceDeleteBanner from './items/sides/welcome/WorkspaceDeleteWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceDeleteView = () => {
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;

  return (
    <WelcomeLayout singleColumn={isTabletOrMobile}>
      <WorkspaceDeleteContent />
      <WorkspaceDeleteBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceDeleteView;
