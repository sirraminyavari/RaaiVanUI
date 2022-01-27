import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { NavLink, useLocation } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import iconList from '../../iconList';
import {
  SETT_TEAM_CONTENT,
  SETT_WORKSPACE_INVOICE_CONTENT,
  SETT_WORKSPACE_PLANS_CONTENT,
} from 'constant/constants';

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
      icon: SETT_TEAM_CONTENT,
    },
    {
      id: '2',
      title: 'طرحها',
      linkTo: `/workspaces/settings/plans/${workspaceID}`,
      show: isSaas,
      icon: SETT_WORKSPACE_PLANS_CONTENT,
    },
    {
      id: '3',
      title: RVDic.AccountManagement,
      linkTo: `/workspaces/settings/account-management/${workspaceID}`,
      show: isSaas,
      icon: SETT_WORKSPACE_INVOICE_CONTENT,
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
              {iconList[item?.icon]({ size: 20 })}
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
