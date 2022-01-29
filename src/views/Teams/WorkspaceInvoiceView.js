import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React from 'react';
import * as Styled from './Teams.styles';
import WorkspaceInvoicePlan from './items/sides/content/WorkspaceInvoicePlan';
import WorkspaceInvoicePlanForm from './items/sides/content/WorkspaceInvoicePlanForm';
import styled from 'styled-components';
import ReturnButton from 'components/Buttons/ReturnButton';
import {
  WORKSPACES_PATH,
  WORKSPACE_PLANS_PATH,
} from './items/others/constants';
import { useHistory, useParams } from 'react-router-dom';

const WorkspaceInvoiceView = () => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const { id: WorkspaceID } = useParams();

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic.SettingsOfN.replace('[n]', RVDic.Workspace),
      linkTo: WORKSPACES_PATH,
    },
    {
      id: 2,
      title: 'صورت‌حساب طرح حرفه‌ای',
      linkTo: '',
    },
  ];

  const handleReturnToPlansView = () =>
    history.push(`${WORKSPACE_PLANS_PATH}/${WorkspaceID}`);

  return (
    <CustomWelcomeLayout noOutline noPadding>
      <div className="rv-border-radius-1">
        <Styled.WorkspaceSettingsHeaderContainer>
          <div className="headerContainer">
            <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
            <ReturnButton onClick={handleReturnToPlansView} />
          </div>
          <Heading type="h1" className="pageTitle">
            {'صورت‌حساب طرح حرفه‌ای'}
          </Heading>
        </Styled.WorkspaceSettingsHeaderContainer>
        <WorkspaceInvoicePlanForm />
      </div>
      <WorkspaceInvoicePlan />
    </CustomWelcomeLayout>
  );
};

export default WorkspaceInvoiceView;

const CustomWelcomeLayout = styled(WelcomeLayout)`
  min-height: auto;
  > div {
    &:last-of-type {
      width: 25rem;
      padding: 0;
      margin: 0 auto;
    }
    &:first-of-type {
      width: 100%;
      padding: 0;

      > div {
        padding: 0 2rem 1rem 2rem;
        box-shadow: 1px 5px 15px #0000001f;
      }
    }
  }
`;
