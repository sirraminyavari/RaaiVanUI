import React from 'react';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import * as Styled from './../../../Teams.styles';
import WorkspaceSubscription from './WorkspaceSubscription';
import {
  WORKSPACES_PATH,
  WORKSPACE_ACCOUNT_MANAGEMENT_PATH,
} from './../../others/constants';

const WorkspaceAccountManagementView = ({ WorkspaceID }) => {
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
    <>
      <div>
        <Styled.WorkspaceSettingsHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {RVDicAccountManagement}
          </Heading>
        </Styled.WorkspaceSettingsHeaderContainer>

        <WorkspaceSubscription />
      </div>
    </>
  );
};

export default WorkspaceAccountManagementView;
