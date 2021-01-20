import Configuration from "views/AdminPanel";
import SystemSettings from "views/AdminPanel/Panels/SystemSettings";
import Users from "views/AdminPanel/Panels/Users";
import Confidentiality from "views/AdminPanel/Panels/Confidentiality";
import UserGroups from "views/AdminPanel/Panels/UserGroups";
import MapConfig from "views/AdminPanel/Panels/MapConfig";
import Knowledge from "views/AdminPanel/Panels/Knowledge";
import DocumentTrees from "views/AdminPanel/Panels/DocumentTrees";
import Forms from "views/AdminPanel/Panels/Forms";
import Polls from "views/AdminPanel/Panels/Polls";
import WorkFlows from "views/AdminPanel/Panels/WorkFlows";
import QaWorkFlow from "views/AdminPanel/Panels/QaWorkFlow";
import DataImport from "views/AdminPanel/Panels/DataImport";
import Notifications from "views/AdminPanel/Panels/Notifications";
import Help from "views/AdminPanel/Panels/Help";
import RemoteServers from "views/AdminPanel/Panels/RemoteServers";

const ConfigRoutes = [
  {
    path: "/configuration",
    name: "admin_configuration",
    exact: true,
    component: Configuration,
  },
  {
    path: "/configuration/systemsettings",
    name: "admin_systemsettings",
    exact: true,
    component: SystemSettings,
  },
  {
    path: "/configuration/users",
    name: "admin_users",
    exact: true,
    component: Users,
  },
  {
    path: "/configuration/confidentiality",
    name: "admin_confidentiality",
    exact: true,
    component: Confidentiality,
  },
  {
    path: "/configuration/usergroups",
    name: "admin_usergroups",
    exact: true,
    component: UserGroups,
  },
  {
    path: "/configuration/map",
    name: "admin_map",
    exact: true,
    component: MapConfig,
  },
  {
    path: "/configuration/knowledge",
    name: "admin_knowledge",
    exact: true,
    component: Knowledge,
  },
  {
    path: "/configuration/documents",
    name: "admin_documents",
    exact: true,
    component: DocumentTrees,
  },
  {
    path: "/configuration/forms",
    name: "admin_forms",
    exact: true,
    component: Forms,
  },
  {
    path: "/configuration/polls",
    name: "admin_polls",
    exact: true,
    component: Polls,
  },
  {
    path: "/configuration/workflows",
    name: "admin_workflows",
    exact: true,
    component: WorkFlows,
  },
  {
    path: "/configuration/qa",
    name: "admin_qa",
    exact: true,
    component: QaWorkFlow,
  },
  {
    path: "/configuration/dataimport",
    name: "admin_dataimport",
    exact: true,
    component: DataImport,
  },
  {
    path: "/configuration/externalnotifications",
    name: "admin_externalnotifications",
    exact: true,
    component: Notifications,
  },
  {
      path: "/configuration/remoteservers",
      name: "admin_remoteservers",
      exact: true,
      component: RemoteServers
  },
  {
    path: "/configuration/help",
    name: "admin_help",
    exact: true,
    component: Help,
  },
];

export default ConfigRoutes;
