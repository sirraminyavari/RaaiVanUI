import { getURL } from 'helpers/helpers';
export const WIDE_BOUNDRY = '1200px';
export const MEDIUM_BOUNDRY = '1020px';
export const MOBILE_BOUNDRY = '600px';

export const GET_NOTIFS_INTERVAL = 15000;

export const FORBIDDEN_ROUTES_IN_SAAS = [
  'newquestion',
  'questions',
  'graph',
  'explorer',
  'dashboard',
];

//! Onboarding Phases
export const INTRO_ONBOARD = 'intro';
export const OPENED = 'opened';

//! Sidebar widths.
export const OPEN_WIDTH = '20';
export const CLOSE_WIDTH = '4';
export const MIN_WIDTH = 250;
export const MAX_WIDTH = 400;

//! Sidebar contents.
export const MAIN_CONTENT = 'main';
export const MANAGE_CONTENT = 'manage';
export const SETTING_CONTENT = 'setting';

//! Paths name
export const ROOT_PATH = '/';
export const AUTH_PATH = '/(auth|login)';
export const ERROR_PATH = '/error/:code';
export const ERROR_NAME = 'error';
export const NEWNODE_PATH = '/newnode/:id';
export const NEWNODE_NAME = 'newnode';
export const NODE_PATH = getURL('Node', { NodeID: ':id' });
export const NODE_NAME = 'node';
export const FORM_PATH = getURL('Form', { ID: ':InstanceID' });
export const FORM_NAME = 'form';
export const POSTS_PATH = getURL('Posts', { PostID: ':PostID' });
export const POSTS_NAME = 'posts';
export const GRAPH_PATH = getURL('Graph');
export const GRAPH_NAME = 'graph';
export const EXPLORER_PATH = getURL('Explorer');
export const EXPLORER_NAME = 'explorer';
export const QUESTIONS_PATH = getURL('Questions');
export const QUESTIONS_NAME = 'questions';
export const QUESTION_PATH = getURL('Question', { QuestionID: ':id' });
export const QUESTION_NAME = 'question';
export const NEW_QUESTION_PATH = getURL('NewQuestion');
export const NEW_QUESTION_NAME = 'newquestion';
export const QA_TAG_PATH = '/qatag/:id';
export const QA_TAG_NAME = 'qatag';
export const USER_SEARCH_PATH = '/usersearch';
export const USER_SEARCH_NAME = 'usersearch';
export const NETWORK_PATH = getURL('Network');
export const NETWORK_NAME = 'network';
export const ONBOARDING_PATH = '/onboarding';
export const ONBOARDING_NAME = 'onboarding';
export const CHANGE_PASS_PATH = '/changepassword';
export const CHANGE_PASS_NAME = '/changepassword';
export const HOME_PATH = getURL('Home');
export const HOME_NAME = 'home';
export const MESSAGES_PATH = getURL('Messages');
export const MESSAGES_NAME = 'messages';
export const DASHBOARD_PATH = getURL('Dashboard');
export const DASHBOARD_NAME = 'dashboard';
export const DO_SEARCH_PATH = getURL('Search', { SearchText: ':searchtext' });
export const DO_SEARCH_NAME = 'search';
export const HELP_PATH = getURL('Help');
export const HELP_NAME = 'help';
export const REPORTS_PATH = getURL('Reports');
export const REPORTS_NAME = 'reports';
export const USER_PATH = getURL('User');
export const USER_WITHID_PATH = getURL('User', { UserID: ':uid' });
export const USER_NAME = 'profile';
export const CLASSES_PATH = getURL('Classes');
export const CLASSES_WITHID_PATH = getURL('Classes', { NodeTypeID: ':id' });
export const CLASSES_NAME = 'advanced_search';
export const TEAMS_PATH = getURL('Applications');
export const TEAMS_NAME = 'teams';
export const LOGIN_PATH = getURL('Login');
export const LOGIN_NAME = 'login';
export const REGISTER_PATH = '/auth/register';
export const REGISTER_NAME = 'register';
export const VERIFICATION_PATH = '/auth/verificationCode';
export const VERIFICATION_NAME = 'verificationCode';
export const VERIFY_RESET_PATH = '/auth/verifyingResetPassword';
export const VERIFY_RESET_NAME = 'verifyingResetPassword';
export const FORGOT_PASS_PATH = '/auth/forgotPassword';
export const FORGOT_PASS_NAME = 'forgotPassword';
export const RESET_PASS_ADDRESS_PATH = '/auth/resetPasswordAddress';
export const RESET_PASS_ADDRESS_NAME = 'resetPasswordAddress';
export const RESET_PASS_PATH = '/auth/resetPassword';
export const RESET_PASS_NAME = 'resetPassword';
export const CONFIG_PATH = '/configuration';
export const CONFIG_NAME = 'admin_configuration';
export const CONFIG_SETTING_PATH = '/configuration/systemsettings';
export const CONFIG_SETTING_NAME = 'admin_systemsettings';
export const CONFIG_USERS_PATH = '/configuration/users';
export const CONFIG_USERS_NAME = 'admin_users';
export const CONFIG_CONFIDENT_PATH = '/configuration/confidentiality';
export const CONFIG_CONFIDENT_NAME = 'admin_confidentiality';
export const CONFIG_GROUPS_PATH = '/configuration/usergroups';
export const CONFIG_GROUPS_NAME = 'admin_usergroups';
export const CONFIG_MAP_PATH = '/configuration/map';
export const CONFIG_MAP_NAME = 'admin_map';
export const CONFIG_KNOWLEDGE_PATH = '/configuration/knowledge';
export const CONFIG_KNOWLEDGE_NAME = 'admin_knowledge';
export const CONFIG_DOCS_PATH = '/configuration/documents';
export const CONFIG_DOCS_NAME = 'admin_documents';
export const CONFIG_FORMS_PATH = '/configuration/forms';
export const CONFIG_FORMS_NAME = 'admin_forms';
export const CONFIG_POLLS_PATH = '/configuration/polls';
export const CONFIG_POLLS_NAME = 'admin_polls';
export const CONFIG_WORKFLOWS_PATH = '/configuration/workflows';
export const CONFIG_WORKFLOWS_NAME = 'admin_workflows';
export const CONFIG_QA_PATH = '/configuration/qa';
export const CONFIG_QA_NAME = 'admin_qa';
export const CONFIG_DATA_PATH = '/configuration/dataimport';
export const CONFIG_DATA_NAME = 'admin_dataimport';
export const CONFIG_EXTERNAL_NOTIFS_PATH =
  '/configuration/externalnotifications';
export const CONFIG_EXTERNAL_NOTIFS_NAME = 'admin_externalnotifications';
export const CONFIG_REMOTE_SERVER_PATH = '/configuration/remoteservers';
export const CONFIG_REMOTE_SERVER_NAME = 'admin_remoteservers';
export const CONFIG_HELP_PATH = '/configuration/help';
export const CONFIG_HELP_NAME = 'admin_help';

//! Sidebar contents
export const SETT_USERS_CONTENT = 'setting-users';
export const SETT_TEAM_CONTENT = 'setting-team';
export const SETT_NOTIFS_CONTENT = 'setting-notifs';
export const SETT_CLASSES_CONTENT = 'setting-classes';

//! Border radius classes
/**
 * @description Border radius
 * @mode Ignore
 * @position (top)
 */
export const IGNORE_RADIUS_TOP = 'rv-ignore-top-radius';
/**
 * @description Border radius
 * @mode Ignore
 * @position (bottom)
 */
export const IGNORE_RADIUS_BOTTOM = 'rv-ignore-bottom-radius';
/**
 * @description Border radius
 * @mode Ignore
 * @position (left)
 */
export const IGNORE_RADIUS_LEFT = 'rv-ignore-left-radius';
/**
 * @description Border radius
 * @mode Ignore
 * @position (right)
 */
export const IGNORE_RADIUS_RIGHT = 'rv-ignore-right-radius';
/**
 * @description Border radius
 * @mode Show
 * @type (1unit)
 */
export const BO_RADIUS_UNIT = 'rv-border-radius-1';
/**
 * @description Border radius
 * @mode Show
 * @type (1/2unit)
 */
export const BO_RADIUS_HALF = 'rv-border-radius-half';
/**
 * @description Border radius
 * @mode Show
 * @type (1/4unit)
 */
export const BO_RADIUS_QUARTER = 'rv-border-radius-quarter';
/**
 * @description Border radius
 * @mode Show
 * @type (circle)
 */
export const BO_RADIUS_CIRCLE = 'rv-circle';
