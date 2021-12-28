import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';

const UsersContent = () => {
  const history = useHistory();
  const location = useLocation();
  const { RVDic, RVGlobal } = useWindow();

  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  const profileItems = [
    {
      id: '1',
      title: RVDic?.Users,
      linkTo: '/configuration/users',
      show: true,
    },
    {
      id: '2',
      title: RVDic?.ManageN.replace('[n]', RVDic.Groups),
      linkTo: '/configuration/usergroups',
      show: isSaas,
    },
    {
      id: '3',
      title: RVDic.Permissions,
      linkTo: '/configuration/userpermissions',
      show: !isSaas,
    },
  ];

  return (
    <>
      <Styled.PanelListWrapper>
        {profileItems?.map((item, key) => {
          const isActiveNav = location.pathname === item.linkTo;
          return item?.show ? (
            <Styled.SettingItemWrapper
              className={isActiveNav && 'avtive-profile-navlink'}
              as={NavLink}
              to={item?.linkTo}
              key={key}>
              <Styled.SettingItemTitle>{item?.title}</Styled.SettingItemTitle>
            </Styled.SettingItemWrapper>
          ) : (
            ''
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};
export default UsersContent;
