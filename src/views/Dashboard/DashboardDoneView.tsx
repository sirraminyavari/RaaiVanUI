import WelcomeLayout from 'layouts/WelcomeLayout';
import { useHistory } from 'react-router-dom';
import DashboardPanelViewContentHeader from './items/contents/DashboardPanelViewContentHeader/DashboardPanelViewContentHeader';
import DashboardPanelViewDoneItem from './items/contents/DashboardPanelViewDoneItem/DashboardPanelViewDoneItem';
import DashboardPanelViewHeader from './items/contents/DashboardPanelViewHeader/DashboardPanelViewHeader';
import DashboardPanelViewSidebar from './items/contents/DashboardPanelViewSidebar/DashboardPanelViewSidebar';
import * as Styles from './items/Dashboard.styles';
import { DASHBOARD_PATH } from './items/others/constants';

const DashboardDoneView = (): JSX.Element => {
  const history = useHistory();

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
            <DashboardPanelViewDoneItem />
          </Styles.DashboardPanelViewContentBody>
        </Styles.DashboardPanelViewContent>
      </Styles.DashboardPanelViewContainer>
    </WelcomeLayout>
  );
};

DashboardDoneView.displayName = 'DashboardDoneView';

export default DashboardDoneView;
