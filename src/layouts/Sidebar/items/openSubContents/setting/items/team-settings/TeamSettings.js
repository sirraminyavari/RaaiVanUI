import { useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';
import { SETTING_CONTENT, SETT_URL_CONTENT } from 'constant/constants';
import { useThemeSlice } from 'store/slice/theme';
import { selectSidebar } from 'store/slice/sidebar/selectors';

const allPermissions = [
  { Name: 'Settings', Icon: 'Settings300.png', URL: 'systemsettings' },
  { Name: 'UsersManagement', Icon: 'User128.png', URL: 'users' },
  {
    Name: 'ManageConfidentialityLevels',
    Icon: 'UserConfidentiality240.png',
    URL: 'confidentiality',
  },
  /*
  {
    Name: 'UserGroupsManagement',
    Icon: 'Group.png',
    OnClick: () => that.access_roles(),
  },
  */
  { Name: 'ManageOntology', Icon: 'Graph.png', URL: 'map' },
  { Name: 'KnowledgeAdmin', Icon: 'Audit200.png', URL: 'knowledge' },
  { Name: 'ContentsManagement', Icon: 'Ledgers240.png', URL: 'documents' },
  { Name: 'ManageForms', Icon: 'Forms240.png', URL: 'forms' },
  { Name: 'ManagePolls', Icon: 'Poll.png', URL: 'polls' },
  { Name: 'ManageWorkflow', Icon: 'Workflow240.png', URL: 'workflows' },
  { Name: 'ManageQA', Icon: 'Question.png', URL: 'qa' },
  { Name: 'DataImport', Icon: 'DataImport128.png', URL: 'dataimport' },
  {
    Name: 'SMSEMailNotifier',
    Icon: 'Notification128.png',
    URL: 'externalnotifications',
  },
  { Name: 'RemoteServers', Icon: 'remote_server.png', URL: 'remoteservers' },
];

const TeamSettings = () => {
  const { RVDic } = useWindow();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  const { configPanels: panelNames } = useSelector(selectSidebar);

  const panels = panelNames
    .map((n) => allPermissions.find((p) => p.Name === n))
    .filter((p) => !!p);

  const handleClickPanel = useCallback(
    (url) => () => {
      dispatch(
        setSidebarContent({
          current: SETT_URL_CONTENT.replace('{url}', url),
          prev: SETTING_CONTENT,
        })
      );
    },
    []
  );

  return (
    <>
      {panels?.map((panel, key) => {
        return (
          <Styled.PanelWrapper
            onClick={handleClickPanel(panel?.URL)}
            key={key}
            as={NavLink}
            isSelected={location.pathname === `/configuration/${panel?.URL}`}
            to={`/configuration/${panel?.URL}`}
          >
            <Styled.PanelImage
              src={`${process.env.PUBLIC_URL}/images/icons/${panel?.Icon}`}
              alt="panel-icon"
            />
            <Styled.PanelLink>
              {RVDic.PRVC[panel?.Name] || RVDic[panel?.Name] || panel?.Name}
            </Styled.PanelLink>
          </Styled.PanelWrapper>
        );
      })}
    </>
  );
};

export default TeamSettings;
