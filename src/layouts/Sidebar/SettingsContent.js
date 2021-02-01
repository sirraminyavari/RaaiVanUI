import { SettingMenu } from './Sidebar.styles';
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
          <SettingMenu key={key}>
            {Icons['arrowLeft']}
            <span style={{ marginRight: '5px' }}>{item}</span>
          </SettingMenu>
        );
      })}
    </>
  );
};

export default SettingContent;
