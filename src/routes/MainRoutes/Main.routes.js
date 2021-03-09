/**
 * Returns a list of main layout routes.
 */
import { lazy } from 'react';
import NavbarRoutes from './Navbar.routes';
import SidebarRoutes from './Sidebar.routes';
const ErrorView = lazy(() =>
  import(/* webpackChunkName: "error-view"*/ 'views/Error/ErrorView')
);
const NewNode = lazy(() =>
  import(/* webpackChunkName: "new-node-view"*/ 'views/NewNode/NewNode')
);
const NodeView = lazy(() =>
  import(/* webpackChunkName: "node-view"*/ 'views/Node/Node-view')
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

const routes = [
  ...NavbarRoutes,
  ...SidebarRoutes,
  {
    path: '/error/:code',
    name: 'error',
    exact: true,
    hasNavSide: false,
    component: ErrorView,
  },
  {
    path: '/changepassword',
    name: 'changepassword',
    exact: true,
    hasNavSide: true,
    component: ChangePassword,
  },
  {
    path: '/newnode/:id',
    name: 'newnode',
    exact: true,
    hasNavSide: true,
    component: NewNode,
  },
  {
    path: '/node/:id',
    name: 'node',
    exact: true,
    hasNavSide: true,
    component: NodeView,
  },
  {
    path: '/form/:InstanceID',
    name: 'form',
    exact: true,
    hasNavSide: true,
    component: FormView,
  },
  {
    path: '/posts/:PostID',
    name: 'posts',
    exact: true,
    hasNavSide: true,
    component: PostView,
  },
  {
    path: '/graph',
    name: 'graph',
    exact: true,
    hasNavSide: false,
    component: GraphView,
  },
  {
    path: '/explorer',
    name: 'explorer',
    exact: true,
    hasNavSide: true,
    component: ExplorerView,
  },
  {
    path: '/questions',
    name: 'questions',
    exact: true,
    hasNavSide: true,
    component: QuestionsView,
  },
  {
    path: '/question/:id',
    name: 'question',
    exact: true,
    hasNavSide: true,
    component: QuestionView,
  },
  {
    path: '/newquestion',
    name: 'newquestion',
    exact: true,
    hasNavSide: true,
    component: NewQuestionView,
  },
  {
    path: '/qatag/:id',
    name: 'qatag',
    exact: true,
    hasNavSide: true,
    component: QATagView,
  },
  {
    path: '/usersearch',
    name: 'usersearch',
    exact: true,
    hasNavSide: true,
    component: SearchUsersView,
  },
  {
    path: '/network',
    name: 'network',
    exact: true,
    hasNavSide: true,
    component: NetworkView,
  },
];

export default routes;
