import * as CN from './ApiHandlers/CNAPI';
import * as CNServices from './ApiHandlers/CNAPI/api-service';
import * as CNTemplates from './ApiHandlers/CNAPI/api-templates';
import * as Docs from './ApiHandlers/docsApi';
import * as FG from './ApiHandlers/FGAPI';
import * as Privacy from './ApiHandlers/privacyApi';
import * as RV from './ApiHandlers/RVApi';
import * as Search from './ApiHandlers/SearchAPI';
import * as Users from './ApiHandlers/usersApi';
import * as Notifications from './ApiHandlers/NotificationsAPI';

export const API = {
  CN: { ...CN, ...CNServices, ...CNTemplates },
  Docs,
  FG,
  Privacy,
  RV,
  Search,
  Users,
  Notifications,
};

export default API;
