import React from 'react';
import { useParams } from 'react-router-dom';
import WelcomeLayout from 'layouts/WelcomeLayout';
import WorkspaceAccountManagementBanner from './items/sides/welcome/WorkspaceAccountManagementWelcome';
import WorkspaceAccountManagementContent from './items/sides/content/WorkspaceAccountManagementContent';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceAccountManagementView = () => {
  const { id: WorkspaceID } = useParams();
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;

  return (
    <WelcomeLayout singleColumn={isTabletOrMobile}>
      <WorkspaceAccountManagementContent WorkspaceID={WorkspaceID} />
      <WorkspaceAccountManagementBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceAccountManagementView;
