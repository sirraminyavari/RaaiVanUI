import useWindow from 'hooks/useWindowContext';
import { useHistory } from 'react-router-dom';
import * as Styles from './DashboardViewHeader.styles';
import DashboardViewHeaderSetting from './DashboardViewHeaderSetting';

export interface IDashboardViewHeader {
  refreshCallback: () => void;
  isLoading?: boolean;
  settingStatus?: boolean;
  settingCallback?: () => void;
}

const DashboardViewHeader = ({
  refreshCallback,
  isLoading,
  settingStatus,
  settingCallback,
}: IDashboardViewHeader): JSX.Element => {
  const { RVDic } = useWindow();
  const history = useHistory();

  const returnToDashboard = () => {
    history.push('/');
  };

  //! RVDic i18n localization
  const RVDicDashboard = RVDic.Dashboard;
  return (
    <>
      <Styles.DashboardHeaderContainer>
        <Styles.DashboardHeaderTitleContainer>
          <Styles.DashboardHeaderTitle>
            {RVDicDashboard}
          </Styles.DashboardHeaderTitle>
          <Styles.DashboardHeaderShadowButton onClick={refreshCallback}>
            <Styles.DashboardHeaderRefreshIcon isLoading={isLoading} />
          </Styles.DashboardHeaderShadowButton>
          <Styles.DashboardHeaderShadowButton
            active={settingStatus}
            onClick={settingCallback}
          >
            <Styles.DashboardHeaderSettingIcon />
          </Styles.DashboardHeaderShadowButton>
        </Styles.DashboardHeaderTitleContainer>
        <Styles.DashboardHeaderReturnButtonContainer>
          <Styles.DashboardHeaderReturnButton onClick={returnToDashboard} />
        </Styles.DashboardHeaderReturnButtonContainer>
      </Styles.DashboardHeaderContainer>
      {settingStatus && <DashboardViewHeaderSetting />}
    </>
  );
};

DashboardViewHeader.displayName = 'DashboardViewHeader';

export default DashboardViewHeader;
