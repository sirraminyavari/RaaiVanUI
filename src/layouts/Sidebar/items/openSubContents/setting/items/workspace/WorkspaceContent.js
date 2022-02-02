import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { NavLink, withRouter } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import iconList from '../../iconList';
import {
  SETT_TEAM_CONTENT,
  SETT_WORKSPACE_INVOICE_CONTENT,
  SETT_WORKSPACE_PLANS_CONTENT,
} from 'constant/constants';
import lastElementOfArray from 'lodash/last';
import {
  WORKSPACE_USER_MANAGEMENT_PATH,
  WORKSPACE_PLANS_PATH,
  WORKSPACE_ACCOUNT_MANAGEMENT_PATH,
} from 'views/Teams/items/others/constants';

const WorkspaceContent = ({ location }) => {
  const { RVDic, RVGlobal } = useWindow();

  const workspaceID = lastElementOfArray(location.pathname.split('/'));
  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  //! RVDic i18n variables
  const RVDicWorkspaceSettings = RVDic.SettingsOfN.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicWorkspacePlans = RVDic.Plans;
  const RVDicAccountManagement = RVDic.AccountManagement;

  const workspaceItems = [
    {
      id: '1',
      title: RVDicWorkspaceSettings,
      linkTo: `${WORKSPACE_USER_MANAGEMENT_PATH}/${workspaceID}`,
      show: isSaas,
      icon: SETT_TEAM_CONTENT,
    },
    {
      id: '2',
      title: RVDicWorkspacePlans,
      linkTo: `${WORKSPACE_PLANS_PATH}/${workspaceID}`,
      show: isSaas,
      icon: SETT_WORKSPACE_PLANS_CONTENT,
    },
    {
      id: '3',
      title: RVDicAccountManagement,
      linkTo: `${WORKSPACE_ACCOUNT_MANAGEMENT_PATH}/${workspaceID}`,
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
export default withRouter(WorkspaceContent);
