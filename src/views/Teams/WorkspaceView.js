import WorkspacePanels from './items/sides/content/WorkspacePanels/WorkspacePanels';
import WelcomeBanner from './items/sides/welcome/WorkspaceWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';

const WorkspaceView = () => {
  return (
    <WelcomeLayout>
      <ScrollBarProvider
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          paddingInline: '1rem',
          marginBlock: '1rem',
        }}>
        <div>
          <WorkspacePanels />
        </div>
      </ScrollBarProvider>
      <WelcomeBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceView;
