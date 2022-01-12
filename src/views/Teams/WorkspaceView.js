import WorkspaceContent from './items/sides/content/WorkspaceContent';
import WelcomeBanner from './items/sides/welcome/WorkspaceWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';

const WorkspaceView = () => {
  return (
    <WelcomeLayout>
      <WorkspaceContent />
      <WelcomeBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceView;
