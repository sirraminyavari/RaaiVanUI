import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React from 'react';
import { useParams } from 'react-router-dom';
import * as Styled from './Teams.styles';
import WorkspaceAccountManagementBanner from './items/sides/welcome/WorkspaceAccountManagementWelcome';
import WorkspaceSubscription from './items/sides/content/WorkspaceSubscription';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import {
  WORKSPACES_PATH,
  WORKSPACE_ACCOUNT_MANAGEMENT_PATH,
} from './items/others/constants';

const WorkspaceAccountManagementView = () => {
  const { id: WorkspaceID } = useParams();
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;
  const { RVDic } = useWindow();

  //! RVDic i18n variables
  const RVDicWorkspaceSettings = RVDic.SettingsOfN.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicAccountManagement = RVDic.AccountManagement;

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDicWorkspaceSettings,
      linkTo: WORKSPACES_PATH,
    },
    {
      id: 2,
      title: RVDicAccountManagement,
      linkTo: `${WORKSPACE_ACCOUNT_MANAGEMENT_PATH}/${WorkspaceID}`,
    },
  ];

  return (
    <WelcomeLayout singleColumn={isTabletOrMobile}>
      <div>
        <Styled.WorkspaceSettingsHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {RVDicAccountManagement}
          </Heading>
        </Styled.WorkspaceSettingsHeaderContainer>

        <WorkspaceSubscription />
      </div>

      <WorkspaceAccountManagementBanner />
    </WelcomeLayout>
  );
};

export default WorkspaceAccountManagementView;
