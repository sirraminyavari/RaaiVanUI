import { lazy } from 'react';
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
    path: '/configuration',
    name: 'admin_configuration',
    exact: true,
    hasNavSide: true,
    component: AdminPanel,
  },
  {
    path: '/configuration/systemsettings',
    name: 'admin_systemsettings',
    exact: true,
    hasNavSide: true,
    component: SystemSettings,
  },
  {
    path: '/configuration/users',
    name: 'admin_users',
    exact: true,
    hasNavSide: true,
    component: Users,
  },
  {
    path: '/configuration/confidentiality',
    name: 'admin_confidentiality',
    exact: true,
    hasNavSide: true,
    component: Confidentiality,
  },
  {
    path: '/configuration/usergroups',
    name: 'admin_usergroups',
    exact: true,
    hasNavSide: true,
    component: UserGroups,
  },
  {
    path: '/configuration/map',
    name: 'admin_map',
    exact: true,
    hasNavSide: true,
    component: MapConfig,
  },
  {
    path: '/configuration/knowledge',
    name: 'admin_knowledge',
    exact: true,
    hasNavSide: true,
    component: Knowledge,
  },
  {
    path: '/configuration/documents',
    name: 'admin_documents',
    exact: true,
    hasNavSide: true,
    component: DocumentTrees,
  },
  {
    path: '/configuration/forms',
    name: 'admin_forms',
    exact: true,
    hasNavSide: true,
    component: Forms,
  },
  {
    path: '/configuration/polls',
    name: 'admin_polls',
    exact: true,
    hasNavSide: true,
    component: Polls,
  },
  {
    path: '/configuration/workflows',
    name: 'admin_workflows',
    exact: true,
    hasNavSide: true,
    component: WorkFlows,
  },
  {
    path: '/configuration/qa',
    name: 'admin_qa',
    exact: true,
    hasNavSide: true,
    component: QaWorkFlow,
  },
  {
    path: '/configuration/dataimport',
    name: 'admin_dataimport',
    exact: true,
    hasNavSide: true,
    component: DataImport,
  },
  {
    path: '/configuration/externalnotifications',
    name: 'admin_externalnotifications',
    exact: true,
    hasNavSide: true,
    component: Notifications,
  },
  {
    path: '/configuration/remoteservers',
    name: 'admin_remoteservers',
    exact: true,
    hasNavSide: true,
    component: RemoteServers,
  },
  {
    path: '/configuration/help',
    name: 'admin_help',
    exact: true,
    hasNavSide: true,
    component: Help,
  },
];

export default ConfigRoutes;
