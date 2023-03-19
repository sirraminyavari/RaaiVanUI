import { IGetDashboardResponse } from 'apiHelper/ApiHandlers/NotificationsAPI';
import { decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import WelcomeLayout from 'layouts/WelcomeLayout';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import DashboardPanelViewContentHeader from './items/contents/DashboardPanelViewContentHeader/DashboardPanelViewContentHeader';
import DashboardPanelViewHeader from './items/contents/DashboardPanelViewHeader/DashboardPanelViewHeader';
import DashboardPanelViewRequestItem from './items/contents/DashboardPanelViewRequestItem/DashboardPanelViewRequestItem';
import DashboardPanelViewSidebar from './items/contents/DashboardPanelViewSidebar/DashboardPanelViewSidebar';
import * as Styles from './items/Dashboard.styles';
import { DASHBOARD_PATH } from './items/others/constants';
import { useDashboardContext } from './items/others/Dashboard.context';
import { fetchDashboardItem } from './items/others/DashboardApiCalls';

const DashboardRequestView = (): JSX.Element => {
  const { RVDic } = useWindowContext();
  const history = useHistory();
  const { isTabletOrMobile } = DimensionHelper();
  const { dashboards } = useDashboardContext();
  const [membershipRequests, setMembershipRequests] =
    useState<IGetDashboardResponse>();
  const [selectedNodeType, setSelectedNodeType] = useState<{
    NodeType: string;
    NodeID: string;
    Badge: number;
  }>();
  const [membershipNodeTypes, setMembershipNodeTypes] = useState<
    {
      NodeType: string;
      NodeID: string;
      Badge: number;
    }[]
  >([]);

  useEffect(() => {
    const membershipRequestsDashboard = dashboards?.ItemSubs.find(
      (item) => item.Type === 'MembershipRequest'
    );
    const membershipNodeTypes = membershipRequestsDashboard?.Sub.map(
      (item) => ({
        NodeType: decodeBase64(item.NodeType),
        NodeID: item.NodeTypeID,
        Badge: item.ToBeDone,
      })
    ).filter((item) => item.Badge > 0);
    setMembershipNodeTypes(membershipNodeTypes || []);
    (async () => {
      const membershipRequestResponse = await fetchDashboardItem({
        Type: 'MembershipRequest',
        Done: false,
        Count: 1_000_000,
        LowerBoundary: 1,
        NodeTypeID: selectedNodeType?.NodeID,
      });

      setMembershipRequests(membershipRequestResponse);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboards, selectedNodeType]);

  const returnToDashboard = () => {
    history.push(DASHBOARD_PATH);
  };

  //TODO RVDic initialization !!
  const RVDicMembershipRequest = RVDic.MembershipRequest;

  return (
    <WelcomeLayout singleColumn noFullHeight noPadding>
      <Styles.DashboardPanelViewContainer>
        <DashboardPanelViewHeader
          title={RVDicMembershipRequest}
          onReturn={returnToDashboard}
        />
        <Styles.DashboardPanelViewContent mobile={isTabletOrMobile}>
          <DashboardPanelViewSidebar
            title="وضعیت وظایف"
            nodeTypes={membershipNodeTypes}
            onToggle={setSelectedNodeType}
            mobile={isTabletOrMobile}
          />
          <Styles.DashboardPanelViewContentBody mobile={isTabletOrMobile}>
            <DashboardPanelViewContentHeader
              type="membershipRequest"
              count={membershipRequests?.TotalCount}
              title={RVDicMembershipRequest}
            />
            {/* <DashboardPanelViewDoneItem /> */}
            {membershipRequests?.Items.map((item) => (
              <DashboardPanelViewRequestItem key={item.DashboardID} {...item} />
            ))}
          </Styles.DashboardPanelViewContentBody>
        </Styles.DashboardPanelViewContent>
      </Styles.DashboardPanelViewContainer>
    </WelcomeLayout>
  );
};

DashboardRequestView.displayName = 'DashboardRequestView';

export default DashboardRequestView;
