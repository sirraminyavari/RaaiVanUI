import { lazy } from 'react';
import {
  CONFIG_CONFIDENT_NAME,
  CONFIG_CONFIDENT_PATH,
  CONFIG_DATA_NAME,
  CONFIG_DATA_PATH,
  CONFIG_DOCS_NAME,
  CONFIG_DOCS_PATH,
  CONFIG_EXTERNAL_NOTIFS_NAME,
  CONFIG_EXTERNAL_NOTIFS_PATH,
  CONFIG_FORMS_NAME,
  CONFIG_FORMS_PATH,
  CONFIG_GROUPS_NAME,
  CONFIG_GROUPS_PATH,
  CONFIG_HELP_NAME,
  CONFIG_HELP_PATH,
  CONFIG_KNOWLEDGE_NAME,
  CONFIG_KNOWLEDGE_PATH,
  CONFIG_MAP_NAME,
  CONFIG_MAP_PATH,
  CONFIG_NAME,
  CONFIG_PATH,
  CONFIG_POLLS_NAME,
  CONFIG_POLLS_PATH,
  CONFIG_QA_NAME,
  CONFIG_QA_PATH,
  CONFIG_REMOTE_SERVER_NAME,
  CONFIG_REMOTE_SERVER_PATH,
  CONFIG_SETTING_NAME,
  CONFIG_SETTING_PATH,
  CONFIG_USERS_NAME,
  CONFIG_USERS_PATH,
  CONFIG_WORKFLOWS_NAME,
  CONFIG_WORKFLOWS_PATH,
} from 'constant/constants';

const AdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "admin-panel-view"*/ 'views/AdminPanel/AdminPanel'
  )
);
const SystemSettings = lazy(() =>
  import(
    /* webpackChunkName: "system-settings-view"*/ 'views/AdminPanel/PanelsView/SystemSettings/SystemSettings'
  )
);
const Users = lazy(() =>
  import(
    /* webpackChunkName: "users-view"*/ 'views/AdminPanel/PanelsView/Users/Users'
  )
);
const Confidentiality = lazy(() =>
  import(
    /* webpackChunkName: "confidentiality-view"*/ 'views/AdminPanel/PanelsView/Confidentiality/Confidentiality'
  )
);
const UserGroups = lazy(() =>
  import(
    /* webpackChunkName: "user-groups-view"*/ 'views/AdminPanel/PanelsView/UserGroups/UserGroups'
  )
);
const MapConfig = lazy(() =>
  import(
    /* webpackChunkName: "map-config-view"*/ 'views/AdminPanel/PanelsView/MapConfig/MapConfig'
  )
);
const Knowledge = lazy(() =>
  import(
    /* webpackChunkName: "knowledge-view"*/ 'views/AdminPanel/PanelsView/Knowledge/Knowledge'
  )
);
const DocumentTrees = lazy(() =>
  import(
    /* webpackChunkName: "document-trees-view"*/ 'views/AdminPanel/PanelsView/DocumentTrees/DataImport'
  )
);
const Forms = lazy(() =>
  import(
    /* webpackChunkName: "forms-view"*/ 'views/AdminPanel/PanelsView/Forms/DataImport'
  )
);
const Polls = lazy(() =>
  import(
    /* webpackChunkName: "polls-view"*/ 'views/AdminPanel/PanelsView/Polls/Polls'
  )
);
const WorkFlows = lazy(() =>
  import(
    /* webpackChunkName: "work-flows-view"*/ 'views/AdminPanel/PanelsView/WorkFlows/WorkFlows'
  )
);
const QaWorkFlow = lazy(() =>
  import(
    /* webpackChunkName: "qa-work-flow-view"*/ 'views/AdminPanel/PanelsView/QaWorkFlow/QaWorkFlow'
  )
);
const DataImport = lazy(() =>
  import(
    /* webpackChunkName: "data-import-view"*/ 'views/AdminPanel/PanelsView/DataImport/DataImport'
  )
);
const Notifications = lazy(() =>
  import(
    /* webpackChunkName: "notifications-view"*/ 'views/AdminPanel/PanelsView/Notifications/Notifications'
  )
);
const Help = lazy(() =>
  import(
    /* webpackChunkName: "help-view"*/ 'views/AdminPanel/PanelsView/Help/Help'
  )
);
const RemoteServers = lazy(() =>
  import(
    /* webpackChunkName: "remote-servers-view"*/ 'views/AdminPanel/PanelsView/RemoteServers/RemoteServers'
  )
);

const ConfigRoutes = [
  {
    path: CONFIG_PATH,
    name: CONFIG_NAME,
    exact: true,
    hasNavSide: true,
    component: AdminPanel,
  },
  {
    path: CONFIG_SETTING_PATH,
    name: CONFIG_SETTING_NAME,
    exact: true,
    hasNavSide: true,
    component: SystemSettings,
  },
  {
    path: CONFIG_USERS_PATH,
    name: CONFIG_USERS_NAME,
    exact: true,
    hasNavSide: true,
    component: Users,
  },
  {
    path: CONFIG_CONFIDENT_PATH,
    name: CONFIG_CONFIDENT_NAME,
    exact: true,
    hasNavSide: true,
    component: Confidentiality,
  },
  {
    path: CONFIG_GROUPS_PATH,
    name: CONFIG_GROUPS_NAME,
    exact: true,
    hasNavSide: true,
    component: UserGroups,
  },
  {
    path: CONFIG_MAP_PATH,
    name: CONFIG_MAP_NAME,
    exact: true,
    hasNavSide: true,
    component: MapConfig,
  },
  {
    path: CONFIG_KNOWLEDGE_PATH,
    name: CONFIG_KNOWLEDGE_NAME,
    exact: true,
    hasNavSide: true,
    component: Knowledge,
  },
  {
    path: CONFIG_DOCS_PATH,
    name: CONFIG_DOCS_NAME,
    exact: true,
    hasNavSide: true,
    component: DocumentTrees,
  },
  {
    path: CONFIG_FORMS_PATH,
    name: CONFIG_FORMS_NAME,
    exact: true,
    hasNavSide: true,
    component: Forms,
  },
  {
    path: CONFIG_POLLS_PATH,
    name: CONFIG_POLLS_NAME,
    exact: true,
    hasNavSide: true,
    component: Polls,
  },
  {
    path: CONFIG_WORKFLOWS_PATH,
    name: CONFIG_WORKFLOWS_NAME,
    exact: true,
    hasNavSide: true,
    component: WorkFlows,
  },
  {
    path: CONFIG_QA_PATH,
    name: CONFIG_QA_NAME,
    exact: true,
    hasNavSide: true,
    component: QaWorkFlow,
  },
  {
    path: CONFIG_DATA_PATH,
    name: CONFIG_DATA_NAME,
    exact: true,
    hasNavSide: true,
    component: DataImport,
  },
  {
    path: CONFIG_EXTERNAL_NOTIFS_PATH,
    name: CONFIG_EXTERNAL_NOTIFS_NAME,
    exact: true,
    hasNavSide: true,
    component: Notifications,
  },
  {
    path: CONFIG_REMOTE_SERVER_PATH,
    name: CONFIG_REMOTE_SERVER_NAME,
    exact: true,
    hasNavSide: true,
    component: RemoteServers,
  },
  {
    path: CONFIG_HELP_PATH,
    name: CONFIG_HELP_NAME,
    exact: true,
    hasNavSide: true,
    component: Help,
  },
];

export default ConfigRoutes;
