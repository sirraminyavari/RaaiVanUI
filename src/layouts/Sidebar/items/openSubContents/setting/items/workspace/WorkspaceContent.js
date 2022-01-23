import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { NavLink, useLocation } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

//TODO This logic needs improvement
const currentWorkspaceID = createSelector(
  (state) => state.applications,
  (applications) => applications.currentApp.WorkspaceID
);

const WorkspaceContent = () => {
  const location = useLocation();
  const { RVDic, RVGlobal } = useWindow();
  const workspaceID = useSelector(currentWorkspaceID);
  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  const workspaceItems = [
    {
      id: '1',
      title: RVDic.ManageN.replace('[n]', RVDic.Users),
      linkTo: `/workspaces/settings/user-management/${workspaceID}`,
      show: isSaas,
      icon: 'users',
    },
    {
      id: '2',
      title: 'طرحها',
      linkTo: `/workspaces/settings/plans/${workspaceID}`,
      show: isSaas,
      icon: 'setting-team',
    },
    {
      id: '3',
      title: RVDic.AccountManagement,
      linkTo: `/workspaces/settings/account-management/${workspaceID}`,
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
