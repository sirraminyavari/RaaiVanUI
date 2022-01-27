import { getURL } from 'helpers/helpers';
export const WIDE_BOUNDRY = '1200px';
export const MEDIUM_BOUNDRY = '1020px';
export const MOBILE_BOUNDRY = '600px';

export const GET_NOTIFS_INTERVAL = 15000;
export const TOAST_TIMEOUT = 5000;

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

//! User settings item name
export const SIDEBAR_WINDOW = 'SidebarWindow';

//! Sidebar widths.
export const OPEN_WIDTH = '20';
export const CLOSE_WIDTH = '4';
export const MIN_WIDTH = 250;
export const MAX_WIDTH = 400;

//! Sidebar contents.
export const MAIN_CONTENT = 'main';
export const MANAGE_CONTENT = 'manage';
export const SETTING_CONTENT = 'setting';
export const PROFILE_CONTENT = 'profile';
export const SETT_USERS_CONTENT = 'setting-users';
export const SETT_TEAM_CONTENT = 'setting-team';
export const SETT_NOTIFS_CONTENT = 'setting-notifs';
export const SETT_WORKSPACE_CONTENT = 'setting-workspace';
export const SETT_WORKSPACE_INVOICE_CONTENT = 'setting-workspace-invoice';
export const SETT_WORKSPACE_PLANS_CONTENT = 'setting-workspace-plans';
export const SETT_CLASSES_CONTENT = 'setting-classes';
export const SETT_URL_CONTENT = 'setting-{url}';

//! Sidebar profile items
export const PROFILE_USER = 'user';
export const PROFILE_RESUME = 'resume';
export const PROFILE_SECURITY = 'security';
export const PROFILE_CUSTOMIZATION = 'customization';
export const PROFILE_MISSIONS = 'missions';

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
export const DO_SEARCH_PATH = getURL('Search', { SearchText: ':searchtext?' });
export const DO_SEARCH_NAME = 'search';
export const HELP_PATH = getURL('Help');
export const HELP_NAME = 'help';
export const REPORTS_PATH = getURL('Reports');
export const REPORTS_NAME = 'reports';
export const USER_PATH = getURL('User');
export const USER_WITHID_PATH = getURL('User', { UserID: ':uid?' });
export const USER_MORE_RELATED_TOPICS_PATH = getURL('User', {
  UserID: 'relatedtopics',
});
export const USER_SECURITY_PATH = getURL('User', { UserID: 'security' });
export const USER_CUSTOMIZATION_PATH = getURL('User', {
  UserID: 'customization',
});
export const USER_NAME = 'profile';
export const CLASSES_PATH = getURL('Classes');
export const CLASSES_WITHID_PATH = getURL('Classes', { NodeTypeID: ':id' });
export const CLASSES_NAME = 'advanced_search';
export const MONITORING_PATH = '/monitoring';
export const MONITORING_NAME = 'monitoring';
// // '/monitoring';
// //
// //
export const MONITORING_TEAMS_PATH = '/monitoring/:ApplicationID';
// // ;
// // getURL('monitoring', { ApplicationID: ':id' })
// // '/monitoring-teams';
export const MONITORING_TEAMS_NAME = 'monitoringTeams';

export const TEAMS_PATH = '/workspaces';
export const TEAMS_NAME = 'teams';
export const LOGIN_PATH = getURL('Login');
export const LOGIN_NAME = 'login';
export const REGISTER_PATH = '/auth/register';
export const VERIFICATION_PATH = '/auth/verificationCode';
export const VERIFY_RESET_PATH = '/auth/verifyingResetPassword';
export const FORGOT_PASS_PATH = '/auth/forgotPassword';
export const RESET_PASS_ADDRESS_PATH = '/auth/resetPasswordAddress';
export const RESET_PASS_PATH = '/auth/resetPassword';
export const CONFIG_PATH = '/configuration';
export const CONFIG_NAME = 'admin_configuration';
export const CONFIG_SETTING_PATH = '/configuration/systemsettings';
export const CONFIG_SETTING_NAME = 'admin_systemsettings';
export const CONFIG_USERS_PATH = '/configuration/users';
export const CONFIG_USERS_NAME = 'admin_users';
export const CONFIG_PERMISSION_NAME = 'user_permissions';
export const CONFIG_CONFIDENT_PATH = '/configuration/confidentiality';
export const CONFIG_CONFIDENT_NAME = 'admin_confidentiality';
export const CONFIG_GROUPS_PATH = '/configuration/usergroups';
export const CONFIG_GROUPS_NAME = 'admin_usergroups';
export const CONFIG_PERMISSIONS_PATH = '/configuration/userpermissions';
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
export const TEMPLATES_SETTING_PATH = '/templates/settings';
export const TEMPLATES_SETTING_NAME = 'admin_configuration';
export const TEMPLATES_ARCHIVE_PATH = '/templates/archived';
export const TEMPLATES_ARCHIVE_NAME = 'admin_configuration';
export const TEAM_SETTINGS_PATH = '/teamsettings/:id';
export const TEAM_SETTINGS_NAME = 'TeamSettings';

// export const MONITORING_PATH = getURL('Monitoring')
// // '/monitoring';
// //
// //
// // export const MONITORING_NAME = 'monitoring';
// export const MONITORING_TEAMS_PATH =  '/monitoring/:id';
// // ;
// // getURL('monitoring', { ApplicationID: ':id' })
// // '/monitoring-teams';
// export const MONITORING_TEAMS_NAME = 'monitoring';
// export const MONITORING_NAME = 'monitoring';

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

/**
 * @description Different kind of calender options
 */
export const JALALI_CALENDAR = 'Jalali';
export const LUNAR_CALENDAR = 'Lunar';
export const GREGORIAN_CALENDAR = 'Gregorian';
export const KURDISH_CALENDAR = 'Kurdish';

/**
 * @description Different kind of language options
 */
export const PERSIAN_LANGUAGE = 'fr';
export const ARABIC_LANGUAGE = 'ar';
export const ENGLISH_LANGUAGE = 'en';
export const KURDISH_LANGUAGE = 'ku';

/**
 * @description Different kind of team size options
 */
export const ONE_TO_TEN = '1 - 10';
export const TEN_TO_TWENTY = '10 - 20';
export const MORE_THEN_TWENTY = 'more than 20';
