import DashboardPanelDate from '../DashboardPanelDate/DashboardPanelDate';
import * as Styles from './DashboardPanelViewToBeDoneItem.styles';

export interface IDashboardPanelViewToBeDoneItem {
  title?: string;
}

const DashboardPanelViewToBeDoneItem =
  ({}: IDashboardPanelViewToBeDoneItem): JSX.Element => {
    return (
      <Styles.DashboardPanelViewToBeDoneItemsContainer>
        <Styles.DashboardPanelViewToBeDoneItemContainer>
          <div>
            <Styles.DashboardPanelViewToBeDoneItemAcceptButton checked />
          </div>
          <Styles.DashboardPanelViewToBeDoneItemContentContainer>
            <Styles.DashboardPanelViewToBeDoneItemTitleContainer>
              <Styles.DashboardPanelViewToBeDoneItemTitle>
                مستندات مربوط به پروژه ابری
                <Styles.DashboardPanelViewToBeDoneItemTitleID>
                  1395960182
                </Styles.DashboardPanelViewToBeDoneItemTitleID>
              </Styles.DashboardPanelViewToBeDoneItemTitle>
              <DashboardPanelDate />
            </Styles.DashboardPanelViewToBeDoneItemTitleContainer>
            <Styles.DashboardPanelViewToBeDoneItemTitleContainer>
              <Styles.DashboardPanelViewToBeDoneItemStatusBadgeContainer>
                <Styles.DashboardPanelViewToBeDoneItemStatusBadge type="error">
                  ارجاع داده شده برای اصلاح
                </Styles.DashboardPanelViewToBeDoneItemStatusBadge>
                <Styles.DashboardPanelViewToBeDoneItemStatusBadge>
                  خشایار جهانیان
                </Styles.DashboardPanelViewToBeDoneItemStatusBadge>
              </Styles.DashboardPanelViewToBeDoneItemStatusBadgeContainer>
              <Styles.DashboardPanelViewToBeDoneItemWorkFlowLabel>
                <Styles.DashboardPanelViewToBeDoneItemWorkFlowLabelIcon />
                جریان کاری ثبت گزارش هفتگی رویدادها
              </Styles.DashboardPanelViewToBeDoneItemWorkFlowLabel>
            </Styles.DashboardPanelViewToBeDoneItemTitleContainer>
          </Styles.DashboardPanelViewToBeDoneItemContentContainer>
        </Styles.DashboardPanelViewToBeDoneItemContainer>
      </Styles.DashboardPanelViewToBeDoneItemsContainer>
    );
  };

DashboardPanelViewToBeDoneItem.displayName = 'DashboardPanelViewToBeDoneItem';

export default DashboardPanelViewToBeDoneItem;
