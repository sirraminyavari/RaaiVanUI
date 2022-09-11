import API from 'apiHelper';
import { decodeBase64 } from 'helpers/helpers';
import WelcomeLayout from 'layouts/WelcomeLayout';
import { useState, useEffect } from 'react';
import DashboardCardsBlock from './items/contents/DashboardCardsBlock/DashboardCardsBlock';
import DashboardViewHeader from './items/contents/DashboardViewHeader/DashboardViewHeader';
import useWindow from 'hooks/useWindowContext';
// import * as Styles from './items/Dashboard.styles';

const DashboardView = (): JSX.Element => {
  const { RVDic } = useWindow();
  const [DashboardGlobals, setDashboardGlobals] = useState<any>([]);
  const [DashboardTemplates, setDashboardTemplates] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settingStatus, setSettingStatus] = useState(false);

  //TODO RVDic initialization !!
  const RVDicQuestion = RVDic.Question;

  const fetchDashboards = async () => {
    setIsLoading(true);
    const { Items } = await API.Notifications.GetDashboardsCount();
    setIsLoading(true);
    const templates = Items.map(({ Done, NotSeen, ToBeDone, Sub }) => {
      return {
        Done,
        ToBeDone,
        NotSeen,
        title: decodeBase64(Sub[0]?.NodeType),
        NodeTypeID: Sub[0]?.NodeTypeID,
      };
    });

    const questionAndRegistrationDashboards = [
      {
        ToBeDone: 0,
        title: RVDicQuestion,
        info: RVDicQuestion,
        DoneLabel: false,
        ToBeDoneLabel: '',
      },
    ];

    setDashboardGlobals(questionAndRegistrationDashboards);
    setDashboardTemplates(templates);
    setIsLoading(false);
  };

  const toggleSetting = () => {
    setSettingStatus((prev) => !prev);
  };
  useEffect(() => {
    fetchDashboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <WelcomeLayout singleColumn noFullHeight>
        <DashboardViewHeader
          refreshCallback={fetchDashboards}
          isLoading={isLoading}
          settingStatus={settingStatus}
          settingCallback={toggleSetting}
        />

        <DashboardCardsBlock
          blockTitle={'بر اساس جریان کاری'}
          cardItems={DashboardGlobals}
        />
        <DashboardCardsBlock
          cardType="template"
          blockTitle={'بر اساس تمپلیت‌ها'}
          cardItems={DashboardTemplates}
        />
      </WelcomeLayout>
    </div>
  );
};

DashboardView.displayName = 'DashboardView';

export default DashboardView;
