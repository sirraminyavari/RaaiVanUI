import { IGetDashboardResponse } from 'apiHelper/ApiHandlers/NotificationsAPI';
import { getNodePageUrl } from 'apiHelper/getPageUrl';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as dashboardAPI from '../../others/DashboardApiCalls';
import DashboardPanelDate from '../DashboardPanelDate/DashboardPanelDate';
import * as Styles from './DashboardPanelViewRequestItem.styles';

export type IDashboardPanelViewRequestItem =
  IGetDashboardResponse['Items'][number];

const DashboardPanelViewRequestItem = (
  requestItem: IDashboardPanelViewRequestItem
): JSX.Element => {
  const [pendingMembers, setPendingMembers] =
    useState<
      Awaited<ReturnType<typeof dashboardAPI.getPendingMembers>>['Members']
    >();
  const [accordionStatus, setAccordionStatus] = useState(false);

  const accordionToggleHandler = async () => {
    let status: boolean = false;
    setAccordionStatus((prev) => {
      status = !prev;
      return !prev;
    });

    if (!status) return;
    const pendingMembers = await dashboardAPI.getPendingMembers({
      NodeID: requestItem.NodeID,
    });
    setPendingMembers(pendingMembers.Members);
    console.log({ pendingMembers });
  };

  return (
    <Styles.DashboardPanelViewRequestItemsContainer>
      <Styles.DashboardPanelViewRequestItemAccordion
        open={accordionStatus}
        onClick={accordionToggleHandler}
        label={
          <DashboardPanelViewRequestItemAccordionLabel
            unCompletedActivities={2}
            href={getNodePageUrl(requestItem.NodeID)}
            label={requestItem.NodeName}
          />
        }
      >
        <Styles.DashboardPanelViewRequestItemDetailsContainer>
          {pendingMembers?.map((member) => {
            return (
              <Styles.DashboardPanelViewRequestItemContainer
                key={member.UserID}
              >
                <Styles.DashboardPanelViewRequestItemActionsContainer>
                  <Styles.DashboardPanelViewRequestItemRejectButton />
                  <Styles.DashboardPanelViewRequestItemAcceptButton />
                </Styles.DashboardPanelViewRequestItemActionsContainer>
                <Styles.DashboardPanelViewRequestItemUserContainer>
                  <Styles.DashboardPanelViewRequestItemUserName>
                    <Styles.DashboardPanelViewRequestItemUserAvatar
                      // @ts-expect-error
                      userImage={member.ImageURL}
                    />
                    {`${member.FirstName} ${member.LastName}`}
                  </Styles.DashboardPanelViewRequestItemUserName>
                  {/* <DashboardPanelDate
                    minimal
                    dateObject={{ date: 'ss', time: 'asd' }}
                  /> */}
                </Styles.DashboardPanelViewRequestItemUserContainer>
              </Styles.DashboardPanelViewRequestItemContainer>
            );
          }) || <LogoLoader />}
        </Styles.DashboardPanelViewRequestItemDetailsContainer>
      </Styles.DashboardPanelViewRequestItemAccordion>
    </Styles.DashboardPanelViewRequestItemsContainer>
  );
};

DashboardPanelViewRequestItem.displayName = 'DashboardPanelViewRequestItem';

export default DashboardPanelViewRequestItem;

interface IDashboardPanelViewRequestItemAccordionLabel {
  unCompletedActivities?: number;
  label?: string;
  href?: string;
}

const DashboardPanelViewRequestItemAccordionLabel = ({
  unCompletedActivities,
  label,
  href = '/',
}: IDashboardPanelViewRequestItemAccordionLabel) => {
  return (
    <Styles.DashboardPanelViewRequestItemLabelContainer>
      <span>
        {label}{' '}
        <Link to={href}>
          <Styles.DashboardPanelViewRequestItemExternalLinkIcon />
        </Link>
      </span>
      {typeof unCompletedActivities === 'number' && (
        <Styles.DashboardPanelViewRequestItemLabelRemainingText>
          {unCompletedActivities} فعالیت تکمیل نشده
        </Styles.DashboardPanelViewRequestItemLabelRemainingText>
      )}
    </Styles.DashboardPanelViewRequestItemLabelContainer>
  );
};
