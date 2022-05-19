import * as CNAPI from './ApiHandlers/CNAPI';
import * as CNAPIServices from './ApiHandlers/CNAPI/api-service';
import * as Docs from './ApiHandlers/docsApi';
import * as FG from './ApiHandlers/FGAPI';
import * as Privacy from './ApiHandlers/privacyApi';
import * as RV from './ApiHandlers/RVApi';
import * as Search from './ApiHandlers/SearchAPI';
import * as Users from './ApiHandlers/usersApi';

export const API = {
  CN: { ...CNAPI, ...CNAPIServices },
  Docs,
  FG,
  Privacy,
  RV,
  Search,
  Users,
};
