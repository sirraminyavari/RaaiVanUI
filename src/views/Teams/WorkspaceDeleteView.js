import WorkspaceDeleteContent from './items/sides/content/WorkspaceDeleteContent';
import WorkspaceDeleteBanner from './items/sides/welcome/WorkspaceDeleteWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';

const WorkspaceDeleteView = () => {
  return (
    <WelcomeLayout>
      <WorkspaceDeleteContent />
      <WorkspaceDeleteBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceDeleteView;
