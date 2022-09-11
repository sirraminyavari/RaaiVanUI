import API from 'apiHelper';
import WelcomeLayout from 'layouts/WelcomeLayout';
import { useLayoutEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import DashboardPanelViewContentHeader from './items/contents/DashboardPanelViewContentHeader/DashboardPanelViewContentHeader';
import DashboardPanelViewHeader from './items/contents/DashboardPanelViewHeader/DashboardPanelViewHeader';
import DashboardPanelViewSidebar from './items/contents/DashboardPanelViewSidebar/DashboardPanelViewSidebar';
import DashboardPanelViewToBeDoneItem from './items/contents/DashboardPanelViewToBeDoneItem/DashboardPanelViewToBeDoneItem';

import * as Styles from './items/Dashboard.styles';
import { DASHBOARD_PATH } from './items/others/constants';

const DashboardDoneView = (): JSX.Element => {
  const [dashboardInfo, setDashboardInfo] = useState<Record<string, any>>({});
  const history = useHistory();
  const { NodeID } = useParams<{ NodeID: string }>();

  useLayoutEffect(() => {
    (async () => {
      const doneItems = await API.Notifications.GetDashboards({
        NodeTypeID: NodeID,
        Done: false,
        Type: 'WorkFlow',
        Count: 20,
        LowerBoundary: 1,
      });
      setDashboardInfo(doneItems);
    })();
  }, []);

  const returnToDashboard = () => {
    history.push(DASHBOARD_PATH);
  };

  //TODO RVDic initialization !!

  return (
    <WelcomeLayout singleColumn noFullHeight noPadding>
      <Styles.DashboardPanelViewContainer>
        <DashboardPanelViewHeader title="پروژه" onReturn={returnToDashboard} />
        <Styles.DashboardPanelViewContent>
          <DashboardPanelViewSidebar title="وضعیت وظایف" />
          <Styles.DashboardPanelViewContentBody>
            <DashboardPanelViewContentHeader title={'پروژه'} />
            <DashboardPanelViewToBeDoneItem />
          </Styles.DashboardPanelViewContentBody>
        </Styles.DashboardPanelViewContent>
      </Styles.DashboardPanelViewContainer>
    </WelcomeLayout>
  );
};

DashboardDoneView.displayName = 'DashboardDoneView';

export default DashboardDoneView;
