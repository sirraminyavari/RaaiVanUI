import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React from 'react';
import * as Styled from '../../../Teams.styles';
import Button from 'components/Buttons/Button';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import CloudIcon from 'components/Icons/CloudIcon/CloudIcon';
import StatusBadge from 'components/Badge/StatusBadge';

const WorkspaceSubscription = ({ sectionTitle }) => {
  const { RVDic } = useWindow();

  //! RVDic i18n variables
  const RVDicActivePlans = RVDic.ActivePlans;
  const RVDicExpiredPlans = RVDic.ExpiredPlans;
  const RVDicPlanInvoice = RVDic.Invoice;
  const RVDicUpgradePlan = RVDic.Upgrade;
  const RVDicAlways = RVDic.Always;
  const RVDicFreeCost = RVDic.Free_Cost;
  const RVDicGigaBytes = RVDic.GigaBytes;
  const RVDicInfiniteDaysRemaining = RVDic.NDaysRemaining.replace('[n]', '∞');

  return (
    <>
      <Styled.WorkspaceAccountSubscriptionContainer>
        <Heading type="h2" className="sectionTitle">
          {RVDicActivePlans}
        </Heading>

        <Styled.WorkspaceAccountSubscriptionItem>
          <div>
            <Styled.WorkspaceAccountSubscriptionItemTitleContainer>
              <Styled.WorkspacePlanImage>
                <UsersIcon />
              </Styled.WorkspacePlanImage>
              <Styled.WorkspaceAccountSubscriptionItemTitle>
                <Styled.WorkspacePrimaryText>
                  {RVDicFreeCost}
                </Styled.WorkspacePrimaryText>
                <Styled.WorkspaceSecondaryText>
                  {RVDicAlways} - 1400/01/09
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemTitle>
            </Styled.WorkspaceAccountSubscriptionItemTitleContainer>
            <Styled.WorkspaceAccountSubscriptionItemIconWrapper>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <UsersIcon />
                <Styled.WorkspaceSecondaryText>
                  5 کاربر
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <CloudIcon />
                <Styled.WorkspaceSecondaryText>
                  5 {RVDicGigaBytes}
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
            </Styled.WorkspaceAccountSubscriptionItemIconWrapper>
          </div>
          <div>
            <Button>{RVDicUpgradePlan}</Button>
            <div style={{ width: '10rem' }}>
              <Styled.WorkspaceSecondaryText>
                {RVDicInfiniteDaysRemaining}
              </Styled.WorkspaceSecondaryText>

              <Styled.WorkspaceAccountSubscriptionProgressBar progressPercentage="80" />
            </div>
          </div>
        </Styled.WorkspaceAccountSubscriptionItem>
      </Styled.WorkspaceAccountSubscriptionContainer>

      <Styled.WorkspaceAccountSubscriptionContainer>
        <Heading type="h2" className="sectionTitle">
          {RVDicExpiredPlans}
        </Heading>

        <Styled.WorkspaceAccountSubscriptionItem>
          <div>
            <Styled.WorkspaceAccountSubscriptionItemTitleContainer>
              <Styled.WorkspacePlanImage muted>
                <UsersIcon />
              </Styled.WorkspacePlanImage>
              <Styled.WorkspaceAccountSubscriptionItemTitle>
                <Styled.WorkspacePrimaryText>
                  {RVDicFreeCost}
                </Styled.WorkspacePrimaryText>
                <Styled.WorkspaceSecondaryText>
                  {RVDicAlways} - 1400/01/09
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemTitle>
            </Styled.WorkspaceAccountSubscriptionItemTitleContainer>
            <Styled.WorkspaceAccountSubscriptionItemIconWrapper>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <UsersIcon />
                <Styled.WorkspaceSecondaryText>
                  5 کاربر
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <CloudIcon />
                <Styled.WorkspaceSecondaryText>
                  5 {RVDicGigaBytes}
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
            </Styled.WorkspaceAccountSubscriptionItemIconWrapper>
          </div>
          <div>
            <Button type="primary-o">{RVDicPlanInvoice}</Button>
            <div style={{ width: '10rem' }}>
              <StatusBadge type="error">{RVDicExpiredPlans}</StatusBadge>
            </div>
          </div>
        </Styled.WorkspaceAccountSubscriptionItem>
      </Styled.WorkspaceAccountSubscriptionContainer>
    </>
  );
};

export default WorkspaceSubscription;
