import DashboardPanelDate from '../DashboardPanelDate/DashboardPanelDate';
import * as Styles from './DashboardPanelViewDoneItem.styles';

export interface IDashboardPanelViewDoneItem {
  title?: string;
}

const DashboardPanelViewDoneItem =
  ({}: IDashboardPanelViewDoneItem): JSX.Element => {
    return (
      <Styles.DashboardPanelViewDoneItemsContainer>
        <Styles.DashboardPanelViewDoneItemAccordion
          label={<DashboardPanelViewDoneItemAccordionLabel />}
        >
          <Styles.DashboardPanelViewDoneItemDetailsContainer>
            {new Array(4).fill(0).map((_, idx, array) => {
              return (
                <>
                  <Styles.DashboardPanelViewDoneItemContainer>
                    <Styles.DashboardPanelViewDoneItemTitle>
                      تایید ویرایش دانشنامه
                    </Styles.DashboardPanelViewDoneItemTitle>
                    <DashboardPanelDate minimal />
                  </Styles.DashboardPanelViewDoneItemContainer>
                  {array.length - 1 !== idx && (
                    <Styles.DashboardPanelViewDoneItemSeparator />
                  )}
                </>
              );
            })}
          </Styles.DashboardPanelViewDoneItemDetailsContainer>
        </Styles.DashboardPanelViewDoneItemAccordion>
      </Styles.DashboardPanelViewDoneItemsContainer>
    );
  };

DashboardPanelViewDoneItem.displayName = 'DashboardPanelViewDoneItem';

export default DashboardPanelViewDoneItem;

const DashboardPanelViewDoneItemAccordionLabel = ({}) => {
  return (
    <Styles.DashboardPanelViewDoneItemLabel>
      <span>مستندات مربوط به پروژه ابری</span>
      <DashboardPanelDate />
    </Styles.DashboardPanelViewDoneItemLabel>
  );
};
