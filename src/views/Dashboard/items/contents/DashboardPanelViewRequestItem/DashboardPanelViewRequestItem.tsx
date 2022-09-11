import DashboardPanelDate from '../DashboardPanelDate/DashboardPanelDate';
import * as Styles from './DashboardPanelViewRequestItem.styles';

export interface IDashboardPanelViewRequestItem {
  title?: string;
}

const DashboardPanelViewRequestItem =
  ({}: IDashboardPanelViewRequestItem): JSX.Element => {
    return (
      <Styles.DashboardPanelViewRequestItemsContainer>
        <Styles.DashboardPanelViewRequestItemAccordion
          label={
            <DashboardPanelViewRequestItemAccordionLabel
              unCompletedActivities={2}
              label="مستندات مربوط به پروژه ابری"
            />
          }
        >
          <Styles.DashboardPanelViewRequestItemDetailsContainer>
            {new Array(4).fill(0).map((_, idx, array) => {
              return (
                <Styles.DashboardPanelViewRequestItemContainer>
                  <Styles.DashboardPanelViewRequestItemActionsContainer>
                    <Styles.DashboardPanelViewRequestItemRejectButton />
                    <Styles.DashboardPanelViewRequestItemAcceptButton />
                  </Styles.DashboardPanelViewRequestItemActionsContainer>
                  <Styles.DashboardPanelViewRequestItemUserContainer>
                    <Styles.DashboardPanelViewRequestItemUserName>
                      {/* @ts-expect-error */}
                      <Styles.DashboardPanelViewRequestItemUserAvatar userImage="/images/Preview.png" />
                      امیرحسین سیف
                    </Styles.DashboardPanelViewRequestItemUserName>
                    <DashboardPanelDate minimal />
                  </Styles.DashboardPanelViewRequestItemUserContainer>
                </Styles.DashboardPanelViewRequestItemContainer>
              );
            })}
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
}

const DashboardPanelViewRequestItemAccordionLabel = ({
  unCompletedActivities,
  label,
}: IDashboardPanelViewRequestItemAccordionLabel) => {
  return (
    <Styles.DashboardPanelViewRequestItemLabelContainer>
      <span>{label}</span>
      {typeof unCompletedActivities === 'number' && (
        <Styles.DashboardPanelViewRequestItemLabelRemainingText>
          {unCompletedActivities} فعالیت تکمیل نشده
        </Styles.DashboardPanelViewRequestItemLabelRemainingText>
      )}
    </Styles.DashboardPanelViewRequestItemLabelContainer>
  );
};
