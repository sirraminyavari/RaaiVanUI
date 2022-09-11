// import useWindow from 'hooks/useWindowContext';
import * as Styles from './DashboardSettingFields.styles';

export interface IDashboardSettingFields {
  onClick?: () => void;
  title?: string;
}

const DashboardSettingFields = (): JSX.Element => {
  // const { RVDic } = useWindow();

  //TODO RVDic initialization !!
  const RVDicSubject = 'موضوع';
  const RVDicUser = 'کاربر';

  return (
    <Styles.DashboardSettingFieldsContainer>
      <Styles.DashboardSettingFieldItem>
        <Styles.DashboardSettingFieldItemTitle>
          {RVDicSubject}
        </Styles.DashboardSettingFieldItemTitle>
        <Styles.DashboardSettingFieldItemTriggerButton />
      </Styles.DashboardSettingFieldItem>
      <Styles.DashboardSettingFieldItem>
        <Styles.DashboardSettingFieldItemTitle>
          {RVDicUser}
        </Styles.DashboardSettingFieldItemTitle>
        <Styles.DashboardSettingFieldItemTriggerButton />
      </Styles.DashboardSettingFieldItem>
    </Styles.DashboardSettingFieldsContainer>
  );
};

DashboardSettingFields.displayName = 'DashboardSettingFields';

export default DashboardSettingFields;
