import WelcomeLayout from 'layouts/WelcomeLayout';
import { useState, useEffect } from 'react';
import DashboardCardsBlock from './items/contents/DashboardCardsBlock/DashboardCardsBlock';
import DashboardViewHeader from './items/contents/DashboardViewHeader/DashboardViewHeader';
import { useDashboardContext } from './items/others/Dashboard.context';
// import * as Styles from './items/Dashboard.styles';

const DashboardView = (): JSX.Element => {
  const { isLoading, reloadDashboards, dashboards } = useDashboardContext();
  const [workflowDashboards, setWorkflowDashboards] = useState<any>([]);
  const [templateDashboards, setTemplateDashboards] = useState<any>([]);
  const [settingStatus, setSettingStatus] = useState(false);

  //TODO RVDic initialization !!

  const toggleSetting = () => {
    setSettingStatus((prev) => !prev);
  };
  useEffect(() => {
    console.log({ dashboards });
    setWorkflowDashboards(
      dashboards?.ItemSubs.filter((item) =>
        ['WorkFlow', 'MembershipRequest'].includes(item.Type)
      )
    );
    setTemplateDashboards(
      dashboards?.ItemSubs.filter((item) => ['Knowledge'].includes(item.Type))
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboards]);

  return (
    <div style={{ width: '100%' }}>
      <WelcomeLayout singleColumn noFullHeight>
        <DashboardViewHeader
          refreshCallback={reloadDashboards}
          isLoading={isLoading}
          settingStatus={settingStatus}
          settingCallback={toggleSetting}
        />

        <DashboardCardsBlock
          blockTitle={'بر اساس جریان کاری'}
          cardItems={workflowDashboards}
        />
        <DashboardCardsBlock
          cardType="template"
          blockTitle={'بر اساس تمپلیت‌ها'}
          cardItems={templateDashboards}
        />
      </WelcomeLayout>
    </div>
  );
};

DashboardView.displayName = 'DashboardView';

export default DashboardView;
