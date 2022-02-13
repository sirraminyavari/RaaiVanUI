import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import WelcomeLayout from 'layouts/WelcomeLayout';
import WorkspaceInvoicePlan from './items/sides/content/WorkspaceInvoicePlan';
import WorkspaceInvoiceContent from './items/sides/content/WorkspaceInvoiceContent';

const WorkspaceInvoiceView = () => {
  const { id: WorkspaceID } = useParams();

  return (
    <CustomWelcomeLayout noOutline noPadding>
      <WorkspaceInvoiceContent WorkspaceID={WorkspaceID} />
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
