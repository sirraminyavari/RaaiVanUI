import WorkspaceContent from './items/sides/content/WorkspaceContent';
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
          <WorkspaceContent />
        </div>
      </ScrollBarProvider>
      <WelcomeBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceView;
