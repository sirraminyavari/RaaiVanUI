import WelcomeLayout from 'layouts/WelcomeLayout';
import { useHistory } from 'react-router-dom';
import DashboardPanelViewContentHeader from './items/contents/DashboardPanelViewContentHeader/DashboardPanelViewContentHeader';
import DashboardPanelViewHeader from './items/contents/DashboardPanelViewHeader/DashboardPanelViewHeader';
import DashboardPanelViewRequestItem from './items/contents/DashboardPanelViewRequestItem/DashboardPanelViewRequestItem';
import DashboardPanelViewSidebar from './items/contents/DashboardPanelViewSidebar/DashboardPanelViewSidebar';
import * as Styles from './items/Dashboard.styles';
import { DASHBOARD_PATH } from './items/others/constants';

const DashboardRequestView = (): JSX.Element => {
  const history = useHistory();

  const returnToDashboard = () => {
    history.push(DASHBOARD_PATH);
  };

  //TODO RVDic initialization !!

  return (
    <WelcomeLayout singleColumn noFullHeight noPadding>
      <Styles.DashboardPanelViewContainer>
        <DashboardPanelViewHeader
          title="درخواست‌های عضویت"
          onReturn={returnToDashboard}
        />
        <Styles.DashboardPanelViewContent>
          <DashboardPanelViewSidebar title="وضعیت وظایف" />
          <Styles.DashboardPanelViewContentBody>
            <DashboardPanelViewContentHeader title="درخواست‌های عضویت" />
            {/* <DashboardPanelViewDoneItem /> */}
            <DashboardPanelViewRequestItem />
          </Styles.DashboardPanelViewContentBody>
        </Styles.DashboardPanelViewContent>
      </Styles.DashboardPanelViewContainer>
    </WelcomeLayout>
  );
};

DashboardRequestView.displayName = 'DashboardRequestView';

export default DashboardRequestView;
