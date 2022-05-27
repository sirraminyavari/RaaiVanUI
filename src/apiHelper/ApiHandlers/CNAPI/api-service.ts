import { API_Provider, encodeBase64 } from 'helpers/helpers';
import { CN_API } from 'constant/apiConstants';
import { apiCallWrapper } from '../apiCallHelpers';
import {
  API_NAME_CN_DISABLE_EXTENSION,
  API_NAME_CN_ENABLE_COMMENTS,
  API_NAME_CN_ENABLE_CONTRIBUTION,
  API_NAME_CN_ENABLE_EXTENSION,
  API_NAME_CN_ENABLE_VERSIONING,
  API_NAME_CN_GET_EXTENSIONS,
  API_NAME_CN_GET_SERVICE,
  API_NAME_CN_IS_COMMUNITY_PAGE,
  API_NAME_CN_SET_SERVICE_DESCRIPTION,
} from 'constant/api-names-cn';
import * as CNDecoders from './decoders';
import * as UserDecoders from 'apiHelper/ApiHandlers/UsersAPI/decoders';
import { IContributor, IServiceSettingBinaryOption } from './types';

/**
 * @description fetches the current settings of the service
 * @param {string} NodeTypeID the id of a class/template
 */
export const getService = ({ NodeTypeID }: { NodeTypeID: string }) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_GET_SERVICE), {
    NodeTypeID,
  });
};

export const getServices = ({
  IsDocument,
  IsKnowledge,
  All,
}: { IsDocument?: boolean; IsKnowledge?: boolean; All?: boolean } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetServices'), {
    IsDocument,
    IsKnowledge,
    All,
  }).then((res: any) => ({
    Services: (res?.Services || []).map((s) => CNDecoders.decodeService(s)),
  }));
};

export const getServiceRegistrationInfo = ({
  NodeTypeID,
}: {
  NodeTypeID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetServiceRegistrationInfo'), {
    NodeTypeID,
  }).then((res: any) => {
    Object.keys(res?.Extensions || {}).forEach(
      (k) => (res.Extensions[k] = CNDecoders.decodeExtension(res.Extensions[k]))
    );

    if (res?.KonwledgeType)
      res.KonwledgeType = CNDecoders.decodeKnowledgeType(res.KonwledgeType);

    return { ...(res || {}) };
  });
};

export const setServiceTitle = ({
  NodeTypeID,
  Title,
}: {
  NodeTypeID: string;
  Title: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetServiceTitle'), {
    NodeTypeID,
    Title: encodeBase64(Title),
  });
};

/**
 * @description sets the description of a service
 * @param {string} NodeTypeID the id of a class/template
 * @param {string} Description the description of the service
 */
export const setServiceDescription = ({
  NodeTypeID,
  Description,
}: {
  NodeTypeID: string;
  Description: string;
}) => {
  return apiCallWrapper(
    API_Provider(CN_API, API_NAME_CN_SET_SERVICE_DESCRIPTION),
    {
      NodeTypeID,
      Description: encodeBase64(Description),
    }
  );
};

export const setServiceSuccessMessage = ({
  NodeTypeID,
  Message,
}: {
  NodeTypeID: string;
  Message: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetServiceSuccessMessage'), {
    NodeTypeID,
    Message: encodeBase64(Message),
  });
};

export const getServiceSuccessMessage = ({
  NodeTypeID,
}: {
  NodeTypeID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetServiceSuccessMessage'), {
    NodeTypeID,
  });
};

export const setServiceAdminType = ({
  NodeTypeID,
  AdminType,
  AdminNodeID,
  Limits,
}: {
  NodeTypeID: string;
  AdminType: string;
  AdminNodeID?: string;
  Limits: string[];
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetServiceAdminType'), {
    NodeTypeID,
    AdminType,
    AdminNodeID,
    Limits: (Limits || []).join('|'),
  });
};

export const setMaxAcceptableAdminLevel = ({
  NodeTypeID,
  Level,
}: {
  NodeTypeID: string;
  Level: number;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetMaxAcceptableAdminLevel'), {
    NodeTypeID,
    MaxAcceptableAdminLevel: Level,
  });
};

export const setContributionLimits = ({
  NodeTypeID,
  Limits,
}: {
  NodeTypeID: string;
  Limits: string[];
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetContributionLimits'), {
    NodeTypeID,
    Limits: (Limits || []).join('|'),
  });
};

export const getContributionLimits = ({
  NodeTypeID,
  NodeID,
}: {
  NodeTypeID?: string;
  NodeID?: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetContributionLimits'), {
    NodeTypeID,
    NodeID,
  });
};

/**
 * @description you can use this API in two ways:
 * 1. get the current state of 'EnableContribution' based on NodeTypeID or NodeID.
 *    If you want to use the API this way, you must leave the 'Value' to be null or undefined
 * 2. set the state of 'EnableContribution'. This usage requires both 'NodeTypeID' and 'Value'
 * @param {string} NodeTypeID the id of the class/template
 * @param {string} NodeID the id of the item
 * @param {boolean} Value the value of the 'EnableContribution' state
 */
export const enableContribution = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_CONTRIBUTION), {
    NodeTypeID,
    NodeID,
    Enable: Value,
  });
};

export const noContentService = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, 'NoContentService'), {
    NodeTypeID,
    NodeID,
    Value,
  });
};

export const isKnowledge = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, 'IsKnowledge'), {
    NodeTypeID,
    NodeID,
    IsKnowledge: Value,
  });
};

export const isDocument = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, 'IsDocument'), {
    NodeTypeID,
    NodeID,
    IsDocument: Value,
  });
};

/**
 * @description you can use this API in two ways:
 * 1. get the current state of 'IsCommunityPage' based on NodeTypeID or NodeID.
 *    If you want to use the API this way, you must leave the 'Value' to be null or undefined
 * 2. set the state of 'IsCommunityPage'. This usage requires both 'NodeTypeID' and 'Value'
 * @param {string} NodeTypeID the id of the class
 * @param {string} NodeID the id of the item
 * @param {boolean} Value the value of the 'IsCommunityPage' state
 */
export const isCommunityPage = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_IS_COMMUNITY_PAGE), {
    NodeTypeID,
    NodeID,
    Value,
  });
};

/**
 * @description you can use this API in two ways:
 * 1. get the current state of 'EnableComments' based on NodeTypeID or NodeID.
 *    If you want to use the API this way, you must leave the 'Value' to be null or undefined
 * 2. set the state of 'EnableComments'. This usage requires both 'NodeTypeID' and 'Value'
 * @param {string} NodeTypeID the id of the class/template
 * @param {string} NodeID the id of the item
 * @param {boolean} Value the value of the 'EnableComments' state
 */
export const enableComments = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_COMMENTS), {
    NodeTypeID,
    NodeID,
    Value,
  });
};

/**
 * @description you can use this API in two ways:
 * 1. get the current state of 'EnablePreviousVersionSelect' based on NodeTypeID or NodeID.
 *    If you want to use the API this way, you must leave the 'Value' to be null or undefined
 * 2. set the state of 'EnablePreviousVersionSelect'. This usage requires both 'NodeTypeID' and 'Value'
 * @param {string} NodeTypeID the id of the class/template
 * @param {string} NodeID the id of the item
 * @param {boolean} Value the value of the 'EnableVersioning' state
 */
export const enableVersioning = ({
  NodeTypeID,
  NodeID,
  Value,
}: IServiceSettingBinaryOption) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_VERSIONING), {
    NodeTypeID,
    NodeID,
    Value,
  });
};

export const isTree = ({ IDs, Value }: { IDs: string[]; Value?: boolean }) => {
  return apiCallWrapper(API_Provider(CN_API, 'IsTree'), {
    IDs: IDs.join('|'),
    IsTree: Value,
  });
};

export const hasUniqueMembership = ({
  IDs,
  Value,
}: {
  IDs: string[];
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'HasUniqueMembership'), {
    IDs: IDs.join('|'),
    Value,
  });
};

export const hasUniqueAdminMember = ({
  IDs,
  Value,
}: {
  IDs: string[];
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'HasUniqueAdminMember'), {
    IDs: IDs.join('|'),
    Value,
  });
};

export const abstractAndKeywordsDisabled = ({
  IDs,
  Value,
}: {
  IDs: string[];
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'AbstractAndKeywordsDisabled'), {
    IDs: IDs.join('|'),
    Value,
  });
};

export const fileUploadDisabled = ({
  IDs,
  Value,
}: {
  IDs: string[];
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'FileUploadDisabled'), {
    IDs: IDs.join('|'),
    Value,
  });
};

export const relatedNodesSelectDisabled = ({
  IDs,
  Value,
}: {
  IDs: string[];
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'RelatedNodesSelectDisabled'), {
    IDs: IDs.join('|'),
    Value,
  });
};

export const editableForAdmin = ({
  NodeTypeID,
  Value,
}: {
  NodeTypeID: string;
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'EditableForAdmin'), {
    NodeTypeID,
    Editable: Value,
  });
};

export const editableForCreator = ({
  NodeTypeID,
  Value,
}: {
  NodeTypeID: string;
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'EditableForCreator'), {
    NodeTypeID,
    Editable: Value,
  });
};

export const editableForOwners = ({
  NodeTypeID,
  Value,
}: {
  NodeTypeID: string;
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'EditableForOwners'), {
    NodeTypeID,
    Editable: Value,
  });
};

export const editableForExperts = ({
  NodeTypeID,
  Value,
}: {
  NodeTypeID: string;
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'editableForExperts'), {
    NodeTypeID,
    Editable: Value,
  });
};

export const editableForMembers = ({
  NodeTypeID,
  Value,
}: {
  NodeTypeID: string;
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'EditableForMembers'), {
    NodeTypeID,
    Editable: Value,
  });
};

export const editSuggestion = ({
  NodeTypeID,
  Value,
}: {
  NodeTypeID: string;
  Value?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'EditSuggestion'), {
    NodeTypeID,
    Enable: Value,
  });
};

export const addFreeUser = ({
  NodeTypeID,
  UserID,
}: {
  NodeTypeID: string;
  UserID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'AddFreeUser'), {
    NodeTypeID,
    UserID,
  });
};

export const removeFreeUser = ({
  NodeTypeID,
  UserID,
}: {
  NodeTypeID: string;
  UserID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'RemoveFreeUser'), {
    NodeTypeID,
    UserID,
  });
};

export const getServiceAdmins = ({ NodeTypeID }: { NodeTypeID: string }) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetServiceAdmins'), {
    NodeTypeID,
  }).then((res: any) => ({
    ServiceAdmins: (res?.ServiceAdmins || []).map((s) =>
      UserDecoders.decodeUser(s)
    ),
  }));
};

export const addServiceAdmin = ({
  NodeTypeID,
  UserID,
}: {
  NodeTypeID: string;
  UserID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'AddServiceAdmin'), {
    NodeTypeID,
    UserID,
  });
};

export const removeServiceAdmin = ({
  NodeTypeID,
  UserID,
}: {
  NodeTypeID: string;
  UserID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'RemoveServiceAdmin'), {
    NodeTypeID,
    UserID,
  });
};

export const isServiceAdmin = ({
  NodeTypeID,
  NodeID,
}: {
  NodeTypeID: string;
  NodeID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'IsServiceAdmin'), {
    NodeTypeID,
    NodeID,
  });
};

export const checkNodeCreationAccess = ({
  NodeTypeID,
}: {
  NodeTypeID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'CheckNodeCreationAccess'), {
    NodeTypeID,
  });
};

export const getAdminAreaLimits = ({
  NodeTypeID,
  NodeID,
}: {
  NodeTypeID: string;
  NodeID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetAdminAreaLimits'), {
    NodeTypeID,
    NodeID,
  }).then((res: any) => ({
    NodeTypes: (res?.NodeTypes || []).map((nt) =>
      CNDecoders.decodeNodeType(nt)
    ),
  }));
};

export const setAdminArea = ({
  NodeID,
  AreaID,
}: {
  NodeID: string;
  AreaID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetAdminArea'), {
    NodeID,
    AreaID,
  });
};

export const setContributors = ({
  NodeID,
  Contributors,
  OwnerID,
}: {
  NodeID: string;
  Contributors: IContributor[];
  OwnerID?: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetContributors'), {
    NodeID,
    OwnerID,
    Contributors: Contributors.map((c) => `${c.UserID}:${c.Share}`).join('|'),
  });
};

/**
 * @description gets the list of extensions of a NodeType
 * @param {string} NodeTypeID the id of a class/template
 * @param {boolean} Initialize if true, initializes the extensions of the class.
 * set this parameter to true only if you want to edit the extensions
 */
export const getExtensions = ({
  NodeTypeID,
  Initialize,
}: {
  NodeTypeID: string;
  Initialize?: boolean;
}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_GET_EXTENSIONS), {
    OwnerID: NodeTypeID,
    Initialize,
  });
};

/**
 * @description enables an extension for a class/template
 * @param {string} NodeTypeID the id of a class/template
 * @param {string} Name the name of the extension
 * valid names are: ["Wiki", "Form", "Posts", "Experts", "Members", "Group", "Browser"]
 */
export const enableExtension = ({
  NodeTypeID,
  Name,
}: {
  NodeTypeID: string;
  Name: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_EXTENSION), {
    OwnerID: NodeTypeID,
    Extension: Name,
  });
};

/**
 * @description disables an extension for a class/template
 * @param {string} NodeTypeID the id of a class/template
 * @param {string} Name the name of the extension
 * valid names are: ["Wiki", "Form", "Posts", "Experts", "Members", "Group", "Browser"]
 */
export const disableExtension = ({
  NodeTypeID,
  Name,
}: {
  NodeTypeID: string;
  Name: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_DISABLE_EXTENSION), {
    OwnerID: NodeTypeID,
    Extension: Name,
  });
};
