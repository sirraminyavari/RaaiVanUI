import Configuration from "views/Configuration";
import SystemSettings from "views/Configuration/Panels/SystemSettings";
import Users from "views/Configuration/Panels/Users";
import Confidentiality from "views/Configuration/Panels/Confidentiality";
import UserGroups from "views/Configuration/Panels/UserGroups";
import MapConfig from "views/Configuration/Panels/MapConfig";
import Knowledge from "views/Configuration/Panels/Knowledge";
import DocumentTrees from "views/Configuration/Panels/DocumentTrees";
import Forms from "views/Configuration/Panels/Forms";
import Polls from "views/Configuration/Panels/Polls";
import WorkFlows from "views/Configuration/Panels/WorkFlows";
import QaWorkFlow from "views/Configuration/Panels/QaWorkFlow";
import DataImport from "views/Configuration/Panels/DataImport";
import Notifications from "views/Configuration/Panels/Notifications";
import Help from "views/Configuration/Panels/Help";
import RemoteServers from "views/Configuration/Panels/RemoteServers";

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
