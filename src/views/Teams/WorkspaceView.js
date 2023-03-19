import WorkspacePanels from './items/sides/content/WorkspacePanels/WorkspacePanels';
import WelcomeBanner from './items/sides/welcome/WorkspaceWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';
import { Scrollbar } from '@cliqmind/rv-components/components/Scrollbar';

const WorkspaceView = () => {
  return (
    <WelcomeLayout noOutline>
      <div style={{ height: '90vh', width: '100%' }}>
        <Scrollbar style={{ paddingInline: '20px' }}>
          <WorkspacePanels />
        </Scrollbar>
      </div>
      <WelcomeBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceView;
