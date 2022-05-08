import WorkspacePanels from './items/sides/content/WorkspacePanels/WorkspacePanels';
import WelcomeBanner from './items/sides/welcome/WorkspaceWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';

const WorkspaceView = () => {
  return (
    <WelcomeLayout withScrollbar>
      <div>
        <WorkspacePanels />
      </div>
      <WelcomeBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceView;
