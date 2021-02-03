import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';

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
            {Icons.arrowLeft}
            <span style={{ marginRight: '5px' }}>{item}</span>
          </Styled.SettingMenu>
        );
      })}
    </>
  );
};

export default SettingContent;
