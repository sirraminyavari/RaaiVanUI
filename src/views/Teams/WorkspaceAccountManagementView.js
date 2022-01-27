import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React from 'react';
import { useParams } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import * as Styled from './Teams.styles';
import WorkspaceAccountManagementBanner from './items/sides/welcome/WorkspaceAccountManagementWelcome';
import WorkspaceSubscription from './items/sides/content/WorkspaceSubscription';

const WorkspaceAccountManagementView = () => {
  const { id: WorkspaceID } = useParams();
  const { RVDic } = useWindow();
  const { isMobile } = DimensionHelper();

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic.SettingsOfN.replace('[n]', RVDic.Workspace),
      linkTo: '/workspaces',
    },
    {
      id: 2,
      title: 'مدیریت حساب',
      linkTo: '',
    },
  ];

  return (
    <WelcomeLayout>
      <div>
        <Styled.WorkspaceSettingsHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {'مدیریت حساب'}
          </Heading>
        </Styled.WorkspaceSettingsHeaderContainer>

        <WorkspaceSubscription />
      </div>

      <WorkspaceAccountManagementBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceAccountManagementView;
