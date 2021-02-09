import * as Styled from './Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';

const settingList = [
  'سطوح محرمانگی',
  'مدیران سامانه',
  'پیکربندی نقشه',
  'فرآیند های ارزیابی دانش',
  'فرم ها',
  'درخت های مستندات',
];

const SettingContent = () => {
  return (
    <>
      {settingList.map((item, key) => {
        return (
          <Styled.SettingMenu key={key}>
            <ArrowIcon dir="left" size={20} />
            <span style={{ marginRight: '5px' }}>{item}</span>
          </Styled.SettingMenu>
        );
      })}
    </>
  );
};

export default SettingContent;
