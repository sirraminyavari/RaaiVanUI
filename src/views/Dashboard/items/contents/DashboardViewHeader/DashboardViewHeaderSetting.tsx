// import useWindow from 'hooks/useWindowContext';
import DashboardSettingField from '../DashboardSettingField/DashboardSettingFields';
import * as Styles from './DashboardViewHeader.styles';

const DashboardViewHeaderSetting = (): JSX.Element => {
  // const { RVDic } = useWindow();

  //! RVDic i18n localization
  const RVDicSettingInfo =
    ':برای آگاهی از اینکه یک موضوع هم اکنون در کارتابل چه کسانی است، یا در کارتابل هر کاربر چه موضوعاتی وجود دارند، آن را انتخاب کنید';
  return (
    <>
      <Styles.DashboardHeaderSettingContainer>
        <Styles.DashboardHeaderSettingTitle>
          {RVDicSettingInfo}
        </Styles.DashboardHeaderSettingTitle>
        <DashboardSettingField />
      </Styles.DashboardHeaderSettingContainer>
    </>
  );
};

DashboardViewHeaderSetting.displayName = 'DashboardViewHeaderSetting';

export default DashboardViewHeaderSetting;
