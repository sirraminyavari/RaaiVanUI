import WorkspacePanels from './items/sides/content/WorkspacePanels/WorkspacePanels';
import WelcomeBanner from './items/sides/welcome/WorkspaceWelcome';
import WelcomeLayout from 'layouts/WelcomeLayout';
import ProductTour from 'views/ProductTour/ProductTour';
import { useHistory } from 'react-router-dom';

const WorkspaceView = () => {
  const history = useHistory();
  return (
    <WelcomeLayout withScrollbar>
      <div>
        <WorkspacePanels />
      </div>
      <WelcomeBanner />

      <ProductTour onRequestClose={() => history.push('/')} />
    </WelcomeLayout>
  );
};

export default WorkspaceView;
