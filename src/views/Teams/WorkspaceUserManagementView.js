import React from 'react';
import { useParams } from 'react-router-dom';
import WelcomeLayout from 'layouts/WelcomeLayout';
import WorkspaceUserManagementContent from './items/sides/content/WorkspaceUserManagement/WorkspaceUserManagement';

const WorkspaceUserManagementView = () => {
  const { id: WorkspaceID } = useParams();
  return (
    <WelcomeLayout>
      <WorkspaceUserManagementContent WorkspaceID={WorkspaceID} />
    </WelcomeLayout>
  );
};

export default WorkspaceUserManagementView;
