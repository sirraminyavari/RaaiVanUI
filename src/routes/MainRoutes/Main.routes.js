/**
 * Returns a list of main layout routes.
 */
import { lazy } from 'react';
import NavbarRoutes from './Navbar.routes';
import SidebarRoutes from './Sidebar.routes';
import {
  CHANGE_PASS_NAME,
  CHANGE_PASS_PATH,
  ERROR_NAME,
  ERROR_PATH,
  EXPLORER_NAME,
  EXPLORER_PATH,
  FORM_NAME,
  FORM_PATH,
  GRAPH_NAME,
  GRAPH_PATH,
  NETWORK_NAME,
  NETWORK_PATH,
  NEWNODE_NAME,
  NEWNODE_PATH,
  NEW_QUESTION_NAME,
  NEW_QUESTION_PATH,
  NODE_NAME,
  NODE_PATH,
  ONBOARDING_NAME,
  ONBOARDING_PATH,
  POSTS_NAME,
  POSTS_PATH,
  QA_TAG_NAME,
  QA_TAG_PATH,
  QUESTIONS_NAME,
  QUESTIONS_PATH,
  QUESTION_NAME,
  QUESTION_PATH,
  TEMPLATES_ARCHIVE_NAME,
  TEMPLATES_ARCHIVE_PATH,
  TEMPLATES_SETTING_NAME,
  TEMPLATES_SETTING_PATH,
  USER_SEARCH_NAME,
  USER_SEARCH_PATH,
  MONITORING_NAME,
  MONITORING_PATH,
  MONITORING_TEAMS_PATH,
  MONITORING_TEAMS_NAME,
} from 'constant/constants';
import TestView from 'views/TestView/TestView';
import Teams from '../../views/Monitoring/MonitoringTeams/Teams';

const ErrorView = lazy(() =>
  import(/* webpackChunkName: "error-view"*/ 'views/Error/ErrorView')
);
const NewNode = lazy(() =>
  import(/* webpackChunkName: "new-node-view"*/ 'views/NewNode/NewNode')
);
const NodeView = lazy(() =>
  import(/* webpackChunkName: "node-view "*/ 'views/Node/Node-view')
);
const FormView = lazy(() =>
  import(/* webpackChunkName: "form-view"*/ 'views/Form/Form-view')
);
const PostView = lazy(() =>
  import(/* webpackChunkName: "post-view"*/ 'views/Post/Post-view')
);
const GraphView = lazy(() =>
  import(/* webpackChunkName: "graph-view"*/ 'views/Graph/Graph-view')
);
const ExplorerView = lazy(() =>
  import(/* webpackChunkName: "explorer-view"*/ 'views/Explorer/Explorer-view')
);
const QuestionsView = lazy(() =>
  import(
    /* webpackChunkName: "questions-view"*/ 'views/Questions/Questions-view'
  )
);
const QuestionView = lazy(() =>
  import(/* webpackChunkName: "question-view"*/ 'views/Question/Question-view')
);
const NewQuestionView = lazy(() =>
  import(
    /* webpackChunkName: "newquestion-view"*/ 'views/NewQuestion/NewQuestion-view'
  )
);
const QATagView = lazy(() =>
  import(/* webpackChunkName: "qatag-view"*/ 'views/QATag/QATag-view')
);
const SearchUsersView = lazy(() =>
  import(
    /* webpackChunkName: "searchusers-view"*/ 'views/SearchUsers/SearchUsers-view'
  )
);
const NetworkView = lazy(() =>
  import(/* webpackChunkName: "network-view"*/ 'views/Network/Network-view')
);
const ChangePassword = lazy(() =>
  import(
    /* webpackChunkName: "change-password-view"*/ 'views/ChangePassword/ChangePassword'
  )
);
const Onboarding = lazy(() =>
  import(/* webpackChunkName: "onboarding-view"*/ 'views/Onboarding/Onboarding')
);
const TemplatesSettings = lazy(() =>
  import(
    /* webpackChunkName: "templates-settings-view"*/ 'views/Templates/settings-view/TemplatesSettings'
  )
);
const TemplatesArchives = lazy(() =>
  import(
    /* webpackChunkName: "templates-archives-view"*/ 'views/Templates/archives-view/TemplatesArchives'
  )
);
const MonitoringView = lazy(() =>
  import(/* webpackChunkName: "monitoring-view"*/ 'views/Monitoring/Monitoring')
);

const MonitoringTeamView = lazy(() =>
  import(
    /* webpackChunkName: "monitoring-view"*/ 'views/Monitoring/MonitoringTeams/Teams'
  )
);

const routes = [
  ...NavbarRoutes,
  ...SidebarRoutes,
  {
    path: ERROR_PATH,
    name: ERROR_NAME,
    exact: true,
    hasNavSide: false,
    component: ErrorView,
  },
  {
    path: CHANGE_PASS_PATH,
    name: CHANGE_PASS_NAME,
    exact: true,
    hasNavSide: true,
    component: ChangePassword,
  },
  {
    path: NEWNODE_PATH,
    name: NEWNODE_NAME,
    exact: true,
    hasNavSide: true,
    component: NewNode,
  },
  {
    path: NODE_PATH,
    name: NODE_NAME,
    exact: true,
    hasNavSide: true,
    component: NodeView,
  },
  {
    path: FORM_PATH,
    name: FORM_NAME,
    exact: true,
    hasNavSide: true,
    component: FormView,
  },
  {
    path: POSTS_PATH,
    name: POSTS_NAME,
    exact: true,
    hasNavSide: true,
    component: PostView,
  },
  {
    path: GRAPH_PATH,
    name: GRAPH_NAME,
    exact: true,
    hasNavSide: false,
    component: GraphView,
  },
  {
    path: EXPLORER_PATH,
    name: EXPLORER_NAME,
    exact: true,
    hasNavSide: true,
    component: ExplorerView,
  },
  {
    path: QUESTIONS_PATH,
    name: QUESTIONS_NAME,
    exact: true,
    hasNavSide: true,
    component: QuestionsView,
  },
  {
    path: QUESTION_PATH,
    name: QUESTION_NAME,
    exact: true,
    hasNavSide: true,
    component: QuestionView,
  },
  {
    path: NEW_QUESTION_PATH,
    name: NEW_QUESTION_NAME,
    exact: true,
    hasNavSide: true,
    component: NewQuestionView,
  },
  {
    path: QA_TAG_PATH,
    name: QA_TAG_NAME,
    exact: true,
    hasNavSide: true,
    component: QATagView,
  },
  {
    path: USER_SEARCH_PATH,
    name: USER_SEARCH_NAME,
    exact: true,
    hasNavSide: true,
    component: SearchUsersView,
  },
  {
    path: NETWORK_PATH,
    name: NETWORK_NAME,
    exact: true,
    hasNavSide: true,
    component: NetworkView,
  },
  {
    path: TEMPLATES_SETTING_PATH,
    name: TEMPLATES_SETTING_NAME,
    exact: true,
    hasNavSide: true,
    component: TemplatesSettings,
  },
  {
    path: TEMPLATES_ARCHIVE_PATH,
    name: TEMPLATES_ARCHIVE_NAME,
    exact: true,
    hasNavSide: true,
    component: TemplatesArchives,
  },
  {
    path: ONBOARDING_PATH,
    name: ONBOARDING_NAME,
    exact: true,
    hasNavSide: false,
    component: Onboarding,
  },
  {
    path: MONITORING_PATH,
    name: MONITORING_NAME,
    exact: true,
    hasNavSide: true,
    component: MonitoringView,
  },
  {
    path: MONITORING_TEAMS_PATH,
    name: MONITORING_NAME,
    exact: true,
    hasNavSide: true,
    component: MonitoringTeamView,
  },
  // {
  //   path: MONITORING_TEAMS_PATH,
  //   name: MONITORING_TEAMS_NAME,
  //   exact: true,
  //   hasNavSide: true,
  //   component: MonitoringTeamView,
  // },

  {
    path: '/ali',
    name: 'ali',
    exact: true,
    hasNavSide: false,
    component: TestView,
  },
];

export default routes;
