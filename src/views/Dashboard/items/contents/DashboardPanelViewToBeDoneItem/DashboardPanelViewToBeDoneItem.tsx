import { IGetDashboardResponse } from 'apiHelper/ApiHandlers/NotificationsAPI';
import { getNodePageUrl } from 'apiHelper/getPageUrl';
// import { decodeBase64 } from 'helpers/helpers';
import { Link } from 'react-router-dom';
import DashboardPanelDate from '../DashboardPanelDate/DashboardPanelDate';
import * as Styles from './DashboardPanelViewToBeDoneItem.styles';

export type IDashboardPanelViewToBeDoneItem =
  IGetDashboardResponse['Items'][number] & {
    Info: {
      WorkFlowName?: string;
      WorkFlowState?: string;
    };
  };

const DashboardPanelViewToBeDoneItem = (
  toBeDoneItem: IDashboardPanelViewToBeDoneItem
): JSX.Element => {
  return (
    <Styles.DashboardPanelViewToBeDoneItemsContainer>
      <Styles.DashboardPanelViewToBeDoneItemContainer>
        {/* <div>
          <Styles.DashboardPanelViewToBeDoneItemAcceptButton checked />
        </div> */}
        <Styles.DashboardPanelViewToBeDoneItemContentContainer>
          <Styles.DashboardPanelViewToBeDoneItemTitleContainer>
            <Styles.DashboardPanelViewToBeDoneItemTitle>
              <Link to={getNodePageUrl(toBeDoneItem.NodeID)}>
                <Styles.DashboardPanelViewToBeDoneItemTitleLink>
                  {toBeDoneItem.NodeName}
                </Styles.DashboardPanelViewToBeDoneItemTitleLink>
              </Link>
              <Styles.DashboardPanelViewToBeDoneItemTitleID>
                {toBeDoneItem.NodeAdditionalID}
              </Styles.DashboardPanelViewToBeDoneItemTitleID>
            </Styles.DashboardPanelViewToBeDoneItemTitle>
            <DashboardPanelDate
              dateObject={{
                date: toBeDoneItem.SendDate.split(' ')[1],
                time: toBeDoneItem.SendDate.split(' ')[0],
              }}
            />
          </Styles.DashboardPanelViewToBeDoneItemTitleContainer>
          <Styles.DashboardPanelViewToBeDoneItemTitleContainer>
            <Styles.DashboardPanelViewToBeDoneItemStatusBadgeContainer>
              <Styles.DashboardPanelViewToBeDoneItemStatusBadge type="error">
                {/* {decodeBase64(toBeDoneItem.Info.WorkFlowState)} */}
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
