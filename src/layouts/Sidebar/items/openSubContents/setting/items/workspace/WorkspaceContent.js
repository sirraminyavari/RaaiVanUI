import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';

const WorkspaceContent = () => {
  const history = useHistory();
  const location = useLocation();
  const { RVDic, RVGlobal } = useWindow();

  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  const workspaceItems = [
    {
      id: '1',
      title: RVDic.ManageN.replace('[n]', RVDic.Users),
      linkTo: '/teams/workspace/settings',
      show: isSaas,
    },
    {
      id: '2',
      title: 'طرح ها',
      linkTo: '/teams/workspace/settings',
      show: isSaas,
    },
    {
      id: '3',
      title: RVDic.AccountManagement,
      linkTo: '/teams/workspace/settings',
      show: isSaas,
    },
  ];

  return (
    <>
      <Styled.PanelListWrapper>
        {workspaceItems?.map((item, key) => {
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
export default WorkspaceContent;
