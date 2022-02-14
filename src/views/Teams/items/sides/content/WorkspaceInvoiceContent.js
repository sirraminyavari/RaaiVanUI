import React from 'react';
import { useHistory } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import * as Styled from '../../../Teams.styles';
import WorkspaceInvoicePlanForm from './WorkspaceInvoicePlanForm';
import ReturnButton from 'components/Buttons/ReturnButton';
import {
  WORKSPACES_PATH,
  WORKSPACE_INVOICE_PATH,
  WORKSPACE_PLANS_PATH,
} from './../../others/constants';

const WorkspaceInvoiceContent = ({ WorkspaceID }) => {
  const { RVDic } = useWindow();
  const history = useHistory();

  const RVDicPriceCalculation = RVDic.PriceCalculation;

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic.SettingsOfN.replace('[n]', RVDic.Workspace),
      linkTo: WORKSPACES_PATH,
    },
    {
      id: 2,
      title: RVDicPriceCalculation,
      linkTo: `${WORKSPACE_INVOICE_PATH}/${WorkspaceID}`,
    },
  ];

  const handleReturnToPlansView = () =>
    history.push(`${WORKSPACE_PLANS_PATH}/${WorkspaceID}`);

  return (
    <>
      <div className="rv-border-radius-1">
        <Styled.WorkspaceSettingsHeaderContainer>
          <div className="headerContainer">
            <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
            <ReturnButton onClick={handleReturnToPlansView} />
          </div>
          <Heading type="h1" className="pageTitle">
            {RVDicPriceCalculation}
          </Heading>
        </Styled.WorkspaceSettingsHeaderContainer>
        <WorkspaceInvoicePlanForm />
      </div>
    </>
  );
};

export default WorkspaceInvoiceContent;
