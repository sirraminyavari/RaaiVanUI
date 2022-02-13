import WelcomeLayout from 'layouts/WelcomeLayout';
import React from 'react';
import { useParams } from 'react-router-dom';
import WorkspacePlansContent from './items/sides/content/WorkspacePlansContent';

const WorkspacePlansView = () => {
  const { id: WorkspaceID } = useParams();

  return (
    <WelcomeLayout noOutline>
      <WorkspacePlansContent WorkspaceID={WorkspaceID} />
    </WelcomeLayout>
  );
};

export default WorkspacePlansView;
