import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import {
  ACTIVATE_TEMPLATE,
  CN_API,
  GET_TEMPLATES,
  GET_TEMPLATE_JSON,
  GET_TEMPLATE_TAGS,
  GET_NODE_TYPES,
} from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

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
              (x) => x.NodeID == g.NodeID
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
  const addNodeAPI = API_Provider(CN_API, 'AddNode');
  return apiCallWrapper(addNodeAPI, {
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
