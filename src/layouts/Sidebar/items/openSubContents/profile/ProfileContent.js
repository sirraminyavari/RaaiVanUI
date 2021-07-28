import { NavLink, useHistory } from 'react-router-dom';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import {
  HOME_PATH,
  PROFILE_CUSTOMIZATION,
  PROFILE_MISSIONS,
  PROFILE_RESUME,
  PROFILE_SECURITY,
  PROFILE_USER,
  USER_CUSTOMIZATION_PATH,
  USER_MAIN_PATH,
  USER_SECURITY_PATH,
} from 'constant/constants';
import iconList from './iconList';

const ProfileContent = () => {
  const history = useHistory();
  const { RV_RevFloat, RVDic, RVGlobal } = useWindow();

  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  const profileItems = [
    {
      id: '1',
      title: 'اطلاعات کاربری',
      icon: PROFILE_USER,
      linkTo: USER_MAIN_PATH,
    },
    { id: '2', title: RVDic.Resume, icon: PROFILE_RESUME, linkTo: '#' },
    {
      id: '3',
      title: ' ورود و امنیت',
      icon: PROFILE_SECURITY,
      linkTo: USER_SECURITY_PATH,
    },
    {
      id: '4',
      title: 'شخصی سازی',
      icon: PROFILE_CUSTOMIZATION,
      linkTo: USER_CUSTOMIZATION_PATH,
    },
    {
      id: '5',
      title: 'ماموریت ها',
      icon: PROFILE_MISSIONS,
      linkTo: USER_MAIN_PATH,
    },
  ];

  const hasResumeItem = (item) => {
    if (isSaas && item?.id === '2') {
      return false;
    }
    return true;
  };

  const handleOnArrowClick = () => {
    history.push(HOME_PATH);
  };

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <SettingIcon />
          <Styled.TitleText>حساب کاربری</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnArrowClick}>
          <ArrowIcon dir={RV_RevFloat} size={25} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.PanelListWrapper>
        {profileItems?.filter(hasResumeItem)?.map((item, key) => {
          return (
            <Styled.SettingItemWrapper as={NavLink} to={item?.linkTo} key={key}>
              {iconList[item?.icon]({ size: 20 })}
              <Styled.SettingItemTitle>{item?.title}</Styled.SettingItemTitle>
            </Styled.SettingItemWrapper>
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};

export default ProfileContent;
