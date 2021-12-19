import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';

const UsersContent = () => {
  const history = useHistory();
  const location = useLocation();
  const { RV_RevFloat, RVDic, RVGlobal } = useWindow();

  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  const profileItems = [
    {
      id: '1',
      title: 'کاربران',
      linkTo: '/configuration/users',
    },
    {
      id: '2',
      title: 'مدیریت گروه‌ها',
      linkTo: '/configuration/users/groups',
      isSaas,
    },
    {
      id: '3',
      title: 'دسترسی‌ها',
      linkTo: '/configuration/users/permissions',
    },
  ];

  const handleOnArrowClick = () => {
    // history.push(HOME_PATH);
  };

  return (
    <>
      <Styled.PanelListWrapper>
        {profileItems?.map((item, key) => {
          const isActiveNav = location.pathname === item.linkTo;
          return (
            <Styled.SettingItemWrapper
              className={isActiveNav && 'avtive-profile-navlink'}
              as={NavLink}
              to={item?.linkTo}
              key={key}>
              <Styled.SettingItemTitle>{item?.title}</Styled.SettingItemTitle>
            </Styled.SettingItemWrapper>
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};
export default UsersContent;
