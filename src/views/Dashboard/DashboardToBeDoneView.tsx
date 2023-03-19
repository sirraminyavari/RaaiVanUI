import {
  IGetDashboardResponse,
  IGetDashboardsCountItems,
} from 'apiHelper/ApiHandlers/NotificationsAPI';
import { decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import WelcomeLayout from 'layouts/WelcomeLayout';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import DashboardPanelViewContentHeader from './items/contents/DashboardPanelViewContentHeader/DashboardPanelViewContentHeader';
import DashboardPanelViewHeader from './items/contents/DashboardPanelViewHeader/DashboardPanelViewHeader';
import DashboardPanelViewSidebar from './items/contents/DashboardPanelViewSidebar/DashboardPanelViewSidebar';
import DashboardPanelViewToBeDoneItem from './items/contents/DashboardPanelViewToBeDoneItem/DashboardPanelViewToBeDoneItem';

import * as Styles from './items/Dashboard.styles';
import { DASHBOARD_PATH } from './items/others/constants';
import { useDashboardContext } from './items/others/Dashboard.context';
import * as dashboardAPI from './items/others/DashboardApiCalls';

const DashboardDoneView = (): JSX.Element => {
  const history = useHistory();
  const { isTabletOrMobile } = DimensionHelper();
  const { RVDic } = useWindowContext();
  const { NodeID } = useParams<{ NodeID: string }>();
  const { dashboards } = useDashboardContext();
  const [dashboardDetails, setDashboardDetails] =
    useState<IGetDashboardsCountItems>();
  const [toBeDoneItems, setToBeDoneItems] = useState<IGetDashboardResponse>();
  const [selectedSubType, setSelectedSubType] = useState<{
    NodeType: string;
    NodeID: string;
    Badge: number;
  }>();
  const [toBeDoneItemNodeTypes, setToBeDoneItemNodeTypes] = useState<
    {
      NodeType: string;
      NodeID: string;
      Badge: number;
    }[]
  >([]);

  //TODO RVDic initialization !!
  const RVDicDashboardSubTypes = RVDic.NTFN.DashboardSubTypes;

  useEffect(() => {
    const dashboardItem = dashboards?.ItemSubs.find(
      (item) => item.NodeTypeID === NodeID
    );

    const doneItemNodeTypes = dashboardItem?.Sub.map((item) => ({
      NodeType:
        RVDicDashboardSubTypes[item.SubType] || decodeBase64(item.SubTypeTitle),
      NodeID: item.SubTypeTitle,
      Badge: item.ToBeDone,
    })).filter((item) => item.Badge > 0);

    setToBeDoneItemNodeTypes(doneItemNodeTypes || []);
    setDashboardDetails(dashboardItem);

    (async () => {
      const toBeDoneItems = await dashboardAPI.fetchDashboardItem({
        NodeTypeID: NodeID,
        Type: dashboardItem?.Type,
        Done: false,
        SubType: selectedSubType?.NodeType,
        SubTypeTitle: selectedSubType?.NodeID,
      });
      setToBeDoneItems(toBeDoneItems);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboards, selectedSubType]);

  const returnToDashboard = () => {
    history.push(DASHBOARD_PATH);
  };

  return (
    <WelcomeLayout singleColumn noFullHeight noPadding>
      <Styles.DashboardPanelViewContainer>
        <DashboardPanelViewHeader
          title={dashboardDetails?.NodeType}
          onReturn={returnToDashboard}
        />
        <Styles.DashboardPanelViewContent mobile={isTabletOrMobile}>
          <DashboardPanelViewSidebar
            title="وضعیت وظایف"
            mobile={isTabletOrMobile}
            nodeTypes={toBeDoneItemNodeTypes}
            onToggle={setSelectedSubType}
          />
          <Styles.DashboardPanelViewContentBody mobile={isTabletOrMobile}>
            <DashboardPanelViewContentHeader
              type="toBeDone"
              title={dashboardDetails?.NodeType}
              count={toBeDoneItems?.TotalCount}
            />
            {toBeDoneItems?.Items.map((item) => (
              <DashboardPanelViewToBeDoneItem {...item} />
            ))}
          </Styles.DashboardPanelViewContentBody>
        </Styles.DashboardPanelViewContent>
      </Styles.DashboardPanelViewContainer>
    </WelcomeLayout>
  );
};

DashboardDoneView.displayName = 'DashboardDoneView';

export default DashboardDoneView;
