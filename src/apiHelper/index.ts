import * as CN from './ApiHandlers/CNAPI';
import * as CNServices from './ApiHandlers/CNAPI/api-service';
import * as CNTemplates from './ApiHandlers/CNAPI/api-templates';
import * as Docs from './ApiHandlers/docsApi';
import * as FG from './ApiHandlers/FGAPI/FGAPI';
import * as Privacy from './ApiHandlers/privacyApi';
import * as RV from './ApiHandlers/RVAPI';
import * as RV_Dictionary from './ApiHandlers/RVAPI/dictionary/dictionary';
import * as Search from './ApiHandlers/SearchAPI';
import * as Users from './ApiHandlers/usersApi';
import * as Notifications from './ApiHandlers/NotificationsAPI';
import * as WFAPI from './ApiHandlers/WFAPI';

export const API = {
  CN: { ...CN, ...CNServices, ...CNTemplates },
  Docs,
  FG,
  Privacy,
  RV: { ...RV, ...RV_Dictionary },
  Search,
  Users,
  Notifications,
  WFAPI,
};

export default API;
