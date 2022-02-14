import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import {
  ADD_NODE_TYPE,
  CN_API,
  GET_CHILD_NODE_TYPES,
  MOVE_NODE_TYPE,
  REMOVE_NODE_TYPE,
  RENAME_NODE_TYPE,
  SET_NODE_TYPE_ORDER,
  ACTIVATE_TEMPLATE,
  GET_TEMPLATES,
  GET_TEMPLATE_JSON,
  GET_TEMPLATE_TAGS,
  GET_NODE_TYPES,
} from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';
import {
  API_NAME_CN_REMOVE_NODE_TYPE,
  API_NAME_CN_RENAME_NODE_TYPE,
} from 'constant/api-names-cn';

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
} = {}) => {
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
export const renameNodeType = ({ NodeTypeID, Name } = {}) => {
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
} = {}) => {
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

export const getGroupsAll = () => {
  const getGroupsAllAPI = API_Provider(CN_API, 'GetGroupsAll');
  return apiCallWrapper(getGroupsAllAPI, {})
    .then((res) => {
      return Object.keys(res?.AllGroups || {})
        .map((key) => res.AllGroups[key]?.Nodes || [])
        .flat()
        .map(
          (g) => (
            (g.IsMember = (res?.Groups || []).some(
              (x) => x.NodeID === g.NodeID
            )),
            g
          )
        );
    })
    .then((res) => {
      return res.map((x) => ({
        ...x,
        Name: decodeBase64(x?.Name),
        NodeType: decodeBase64(x?.NodeType),
        Members:
          x?.Members?.map((member) => ({
            ...member,
            FullName: decodeBase64(member?.FullName),
            FirstName: decodeBase64(member?.FirstName),
            LastName: decodeBase64(member?.LastName),
          })) || [],
      }));
    });
};

export const addMember = (NodeID, UserID) => {
  const addMemberAPI = API_Provider(CN_API, 'AddMember');
  return apiCallWrapper(addMemberAPI, { NodeID, UserID });
};

export const removeMember = (NodeID, UserID) => {
  const removeMemberAPI = API_Provider(CN_API, 'RemoveMember');
  return apiCallWrapper(removeMemberAPI, { NodeID, UserID });
};

export const addNode = (Name, NodeTypeID) => {
  return apiCallWrapper(API_Provider(CN_API, 'AddNode'), {
    NodeTypeID,
    Name: encodeBase64(Name),
  });
};

export const modifyNodeName = (Name, NodeID) => {
  const modifyNodeNameAPI = API_Provider(CN_API, 'ModifyNodeName');
  return apiCallWrapper(modifyNodeNameAPI, {
    NodeID,
    Name: encodeBase64(Name),
  });
};

export const removeNode = (NodeID) => {
  const removeNodeAPI = API_Provider(CN_API, 'RemoveNode');
  return apiCallWrapper(removeNodeAPI, {
    NodeID,
  });
};

export const saveMembers = (NodeID, UserIDs) => {
  const saveMembersAPI = API_Provider(CN_API, 'SaveMembers');
  return apiCallWrapper(saveMembersAPI, {
    NodeID,
    UserIDs: UserIDs.join('|'),
  });
};

/**
<<<<<<< HEAD
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
  const getChildNodeTypesAPI = API_Provider(CN_API, GET_CHILD_NODE_TYPES);

  return apiCallWrapper(getChildNodeTypesAPI, {
    NodeTypeID: nodeTypeId,
    Count: count,
    Archive: archive,
    Icon: icon,
  });
  //   .then((x) =>
  //   x?.NodeTypes.map((n) => ({
  //     ...n,
  //     TypeName: decodeBase64(n?.TypeName),
  //   }))
  // );
};

/**
 * @description create new node type
 * @param Name
 * @param ParentID
 * @param IsCategory
 * @return {Promise<ValidationOptions.unknown>}
 */
export const addNodeType = ({ Name, ParentID, IsCategory } = {}) => {
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

/**
 * @description Get templates.
 * @param {String?} TagID if provided, fetches the templates related to this tag, otherwise fetches all of the templates
 * @returns Promise.
 */
export const getTemplates = ({ TagID } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, GET_TEMPLATES), { TagID });
};

/**
 * @description fetches the categories of templates
 * @returns Promise.
 */
export const getTemplateTags = () => {
  return apiCallWrapper(API_Provider(CN_API, GET_TEMPLATE_TAGS), {});
};

/**
 * @description Gets a template object
 * @param {String} NodeTypeID the id of the template
 * @returns Promise.
 */
export const getTemplateJSON = ({ NodeTypeID } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, GET_TEMPLATE_JSON), {
    NodeTypeID,
  });
};

export const setNodeTypesOrder = ({ NodeTypeIDs } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, SET_NODE_TYPE_ORDER), {
    NodeTypeIDs: NodeTypeIDs.join('|'),
  });
};

// export const renameNodeType = ({ Name, NodeTypeID } = {}) => {
//   return apiCallWrapper(API_Provider(CN_API, RENAME_NODE_TYPE), {
//     Name: encodeBase64(Name),
//     NodeTypeID,
//   });
// };

// export const removeNodeType = ({
//   NodeTypeID,
//   NodeTypeIDs,
//   RemoveHierarchy = false,
// } = {}) => {
//   return apiCallWrapper(API_Provider(CN_API, REMOVE_NODE_TYPE), {
//     NodeTypeID,
//     NodeTypeIDs,
//     RemoveHierarchy,
//   });
// };

/**
 * @description Activate a template.
 * @param {any} Template -The template object to be activated.
 * @returns Promise.
 */
export const activateTemplate = ({ Template } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, ACTIVATE_TEMPLATE), {
    Template: encodeBase64(JSON.stringify(Template || {})),
  });
};
