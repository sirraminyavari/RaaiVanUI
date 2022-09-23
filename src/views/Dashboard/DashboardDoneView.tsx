import {
  IGetDashboardResponse,
  IGetDashboardsCountItems,
} from 'apiHelper/ApiHandlers/NotificationsAPI';
import { decodeBase64 } from 'helpers/helpers';
import WelcomeLayout from 'layouts/WelcomeLayout';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import DashboardPanelViewContentHeader from './items/contents/DashboardPanelViewContentHeader/DashboardPanelViewContentHeader';
import DashboardPanelViewDoneItem from './items/contents/DashboardPanelViewDoneItem/DashboardPanelViewDoneItem';
import DashboardPanelViewHeader from './items/contents/DashboardPanelViewHeader/DashboardPanelViewHeader';
import DashboardPanelViewSidebar from './items/contents/DashboardPanelViewSidebar/DashboardPanelViewSidebar';
import * as Styles from './items/Dashboard.styles';
import { DASHBOARD_PATH } from './items/others/constants';
import { useDashboardContext } from './items/others/Dashboard.context';
import * as dashboardAPI from './items/others/DashboardApiCalls';

const DashboardDoneView = (): JSX.Element => {
  const history = useHistory();
  const { isTabletOrMobile } = DimensionHelper();
  const { NodeID } = useParams<{ NodeID: string }>();
  const { dashboards } = useDashboardContext();
  const [dashboardDetails, setDashboardDetails] =
    useState<IGetDashboardsCountItems>();
  const [doneItems, setDoneItems] = useState<IGetDashboardResponse>();
  const [selectedSubType, setSelectedSubType] = useState<{
    NodeType: string;
    NodeID: string;
    Badge: number;
  }>();
  const [doneItemNodeTypes, setDoneItemNodeTypes] = useState<
    {
      NodeType: string;
      NodeID: string;
      Badge: number;
    }[]
  >([]);
  const [workflowStates, setWorkflowStates] = useState<{
    DoneAndInWorkFlow?: number;
    DoneAndNotInWorkFlow?: number;
  }>();

  useEffect(() => {
    const dashboardItem = dashboards?.ItemSubs.find(
      (item) => item.NodeTypeID === NodeID
    );
    setWorkflowStates({
      DoneAndInWorkFlow: Number(dashboardItem?.DoneAndInWorkFlow),
      DoneAndNotInWorkFlow: Number(dashboardItem?.DoneAndNotInWorkFlow),
    });
    const doneItemNodeTypes = dashboardItem?.Sub.map((item) => ({
      NodeType: decodeBase64(item.SubTypeTitle),
      NodeID: item.SubTypeTitle,
      Badge: item.Done,
    })).filter((item) => item.Badge > 0);
    setDoneItemNodeTypes(doneItemNodeTypes || []);
    setDashboardDetails(dashboardItem);

    (async () => {
      let doneItems;
      if (
        ['DoneAndInWorkFlow', 'DoneAndNotInWorkFlow'].includes(
          selectedSubType?.NodeID || ''
        )
      )
        doneItems = await dashboardAPI.fetchDashboardItem({
          NodeTypeID: NodeID,
          Type: dashboardItem?.Type,
          // Done: true,
          InWorkFlow: selectedSubType?.NodeID === 'DoneAndInWorkFlow',
          DistinctItems: true,
        });
      else
        doneItems = await dashboardAPI.fetchDashboardItem({
          NodeTypeID: NodeID,
          Type: dashboardItem?.Type,
          Done: true,
          SubType: selectedSubType?.NodeType,
          SubTypeTitle: selectedSubType?.NodeID,
        });
      setDoneItems(doneItems);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboards, selectedSubType]);

  const returnToDashboard = () => {
    history.push(DASHBOARD_PATH);
  };

  //TODO RVDic initialization !!

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
            onToggle={setSelectedSubType}
            nodeTypes={doneItemNodeTypes}
            mobile={isTabletOrMobile}
            DoneAndInWorkFlowTypeBadge={workflowStates?.DoneAndInWorkFlow}
            DoneAndNotInWorkFlowTypeBadge={workflowStates?.DoneAndNotInWorkFlow}
          />
          <Styles.DashboardPanelViewContentBody mobile={isTabletOrMobile}>
            <DashboardPanelViewContentHeader
              type="done"
              count={doneItems?.TotalCount}
              title={dashboardDetails?.NodeType}
            />

            {doneItems?.Items.map((item) => (
              <DashboardPanelViewDoneItem {...item} />
            ))}
          </Styles.DashboardPanelViewContentBody>
        </Styles.DashboardPanelViewContent>
      </Styles.DashboardPanelViewContainer>
    </WelcomeLayout>
  );
};

DashboardDoneView.displayName = 'DashboardDoneView';

export default DashboardDoneView;
