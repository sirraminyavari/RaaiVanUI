import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import {
  ADD_NODE_TYPE,
  CN_API,
  GET_CHILD_NODE_TYPES,
  MOVE_NODE_TYPE,
  SET_NODE_TYPE_ORDER,
  ACTIVATE_TEMPLATE,
  GET_TEMPLATES,
  GET_TEMPLATE_JSON,
  GET_TEMPLATE_TAGS,
  GET_NODE_TYPES,
} from 'constant/apiConstants';
import { apiCallWrapper } from '../apiCallHelpers';
import {
  API_NAME_CN_GET_ALL_FIELDS_OF_ACTIVITY,
  API_NAME_CN_REMOVE_NODE_TYPE,
  API_NAME_CN_RENAME_NODE_TYPE,
} from 'constant/api-names-cn';
import * as UserDecoders from 'apiHelper/ApiHandlers/UsersAPI/decoders';

/**
 * @description fetches NodeTypes based on provided parameters and filters
 */
export const getNodeTypes = ({
  NodeTypeIDs,
  GrabSubNodeTypes,
  SearchText,
  IsKnowledge,
  IsDocument,
  Archive,
  Icon,
  Extensions,
  Count,
  LowerBoundary,
  HasChild,
  Tree,
  CheckAccess,
}) => {
  return apiCallWrapper(API_Provider(CN_API, GET_NODE_TYPES), {
    NodeTypeIDs: (NodeTypeIDs || []).join('|'),
    GrabSubNodeTypes,
    SearchText,
    IsKnowledge,
    IsDocument,
    Archive,
    Icon,
    Extensions: (Extensions || []).join(','),
    Count,
    LowerBoundary,
    HasChild,
    Tree,
    CheckAccess,
  });
};

/**
 * @description renames a NodeType/Class/Template
 * @param {string} NodeTypeID id of the class/template
 * @param {string} Name new name of the class/template
 */
export const renameNodeType = ({ NodeTypeID, Name }) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_RENAME_NODE_TYPE), {
    NodeTypeID,
    Name: encodeBase64(Name),
  });
};

/**
 * @description removes a number of NodeTypes simultaneously
 * @param {string[]} NodeTypeIDs array of ids of the classes/templates
 * @param {string} NodeTypeID id of the class/template. The API ignores this parameter if NodeTypeIDs array is not empty
 * @param {boolean?} RemoveHierarchy if true, the children NodeTypes will also be removed
 */
export const removeNodeType = ({
  NodeTypeIDs,
  NodeTypeID,
  RemoveHierarchy,
}) => {
  const ids = NodeTypeIDs?.length
    ? NodeTypeIDs
    : !!NodeTypeID
    ? [NodeTypeID]
    : [];

  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_REMOVE_NODE_TYPE), {
    NodeTypeIDs: ids,
    RemoveHierarchy,
  });
};

export const setNodeTypeAdditionalId = ({
  NodeTypeID,
  AdditionalID,
}: {
  NodeTypeID: string;
  AdditionalID: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetNodeTypeAdditionalID'), {
    NodeTypeID,
    AdditionalID: encodeBase64(AdditionalID),
  });
};

export const setAdditionalIdPattern = ({
  NodeTypeID,
  Pattern,
}: {
  NodeTypeID: string;
  Pattern: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetAdditionalIDPattern'), {
    NodeTypeID,
    AdditionalIDPattern: encodeBase64(Pattern),
  });
};

export const getGroupsAll = () => {
  return apiCallWrapper(API_Provider(CN_API, 'GetGroupsAll'), {})
    .then((res: any) => {
      return Object.keys(res?.AllGroups || {})
        .map((key) => res.AllGroups[key]?.Nodes || [])
        .flat()
        .map((g) => {
          g.IsMember = (res?.Groups || []).some((x) => x.NodeID === g.NodeID);
          return g;
        });
    })
    .then((res) => {
      return res.map((x) => ({
        ...x,
        Name: decodeBase64(x?.Name),
        NodeType: decodeBase64(x?.NodeType),
        Members: (x?.Members || []).map((member) =>
          UserDecoders.decodeUser(member)
        ),
      }));
    });
};

export const addMember = (NodeID, UserID) => {
  return apiCallWrapper(API_Provider(CN_API, 'AddMember'), { NodeID, UserID });
};

export const removeMember = (NodeID, UserID) => {
  return apiCallWrapper(API_Provider(CN_API, 'RemoveMember'), {
    NodeID,
    UserID,
  });
};

export const addNode = (Name, NodeTypeID) => {
  return apiCallWrapper(API_Provider(CN_API, 'AddNode'), {
    NodeTypeID,
    Name: encodeBase64(Name),
  });
};

export const modifyNodeName = (Name, NodeID) => {
  return apiCallWrapper(API_Provider(CN_API, 'ModifyNodeName'), {
    NodeID,
    Name: encodeBase64(Name),
  });
};

export const removeNode = (NodeID) => {
  return apiCallWrapper(API_Provider(CN_API, 'RemoveNode'), {
    NodeID,
  });
};

export const saveMembers = (NodeID, UserIDs) => {
  return apiCallWrapper(API_Provider(CN_API, 'SaveMembers'), {
    NodeID,
    UserIDs: UserIDs.join('|'),
  });
};

/**
 * @description Get node types.
 * @param {String} nodeTypeId -The id of node.
 * @param {String} count -The number of nodes to fetch.
 * @param {Boolean} archive - Get archives or not? .
 * @param {Boolean} icon - Get icon or not? .
 * @returns Promise.
 */
export const getChildNodeTypes = ({
  nodeTypeId = '',
  count = '',
  archive = false,
  icon = true,
}) => {
  return apiCallWrapper(API_Provider(CN_API, GET_CHILD_NODE_TYPES), {
    NodeTypeID: nodeTypeId,
    Count: count,
    Archive: archive,
    Icon: icon,
  });
};

/**
 * @description create new node type
 * @param Name
 * @param ParentID
 * @param IsCategory
 * @return {Promise<ValidationOptions.unknown>}
 */
export const addNodeType = ({ Name, ParentID, IsCategory }) => {
  return apiCallWrapper(API_Provider(CN_API, ADD_NODE_TYPE), {
    Name: encodeBase64(Name),
    ParentID,
    IsCategory,
  });
};

export const moveNodeType = ({ NodeTypeID, ParentID }) => {
  return apiCallWrapper(API_Provider(CN_API, MOVE_NODE_TYPE), {
    ParentID,
    NodeTypeID,
  });
};

//TODO needs review to complete api return types
export interface IGetAllFieldsOfActivity {
  Items: {
    NodeID: string;
    Name: string;
    AvatarName: string;
  }[];
}

/**
 * @description fetches all fields of activity
 */
export const getAllFieldsOfActivity = () => {
  return apiCallWrapper<IGetAllFieldsOfActivity>(
    API_Provider(CN_API, API_NAME_CN_GET_ALL_FIELDS_OF_ACTIVITY),
    {}
  );
};

/**
 * @description fetches the categories of templates
 * @returns Promise.
 */
export const getTemplateTags = () => {
  return apiCallWrapper(API_Provider(CN_API, GET_TEMPLATE_TAGS), {});
};

/**
 * @description Get templates.
 * @param {String?} TagID if provided, fetches the templates related to this tag, otherwise fetches all of the templates
 * @returns Promise.
 */
export const getTemplates = ({ TagID }) => {
  return apiCallWrapper(API_Provider(CN_API, GET_TEMPLATES), { TagID });
};

/**
 * @description Gets a template object
 * @param {String} prop.NodeTypeID the id of the template
 * @returns Promise.
 */
export const getTemplateJSON = ({ NodeTypeID }) => {
  return apiCallWrapper(API_Provider(CN_API, GET_TEMPLATE_JSON), {
    NodeTypeID,
  });
};

export const setNodeTypesOrder = ({ NodeTypeIDs }) => {
  return apiCallWrapper(API_Provider(CN_API, SET_NODE_TYPE_ORDER), {
    NodeTypeIDs: NodeTypeIDs.join('|'),
  });
};

/**
 * @description Activate a template.
 * @param {any} Template -The template object to be activated.
 * @returns Promise.
 */
export const activateTemplate = ({ Template }) => {
  return apiCallWrapper(API_Provider(CN_API, ACTIVATE_TEMPLATE), {
    Template: encodeBase64(JSON.stringify(Template || {})),
  });
};

/**
 * @description get the preview of a Template
 * @param {string} NodeTypeID -The template object to be activated.
 * @returns Promise.
 */
export const getTemplatePreview = ({ NodeTypeID }) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetTemplatePreview'), {
    NodeTypeID,
  });
};
