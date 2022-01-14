import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import {
  CN_API,
  GET_CHILD_NODE_TYPES,
  GET_NODE_TYPES,
} from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

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
 * @description Get node types.
 * @param {String} nodeTypeId -The id of node.
 * @param {String} count -The number of nodes to fetch.
 * @param {Boolean} archive - Get archives or not? .
 * @param {Boolean} icon - Get icon or not? .
 * @returns Promise.
 */
export const getChildNodeTypes = (
  nodeTypeId = '',
  count = '',
  archive = false,
  icon = true
) => {
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

export const getNodeTypes = () => {
  const getNodeTypesAPI = API_Provider(CN_API, GET_NODE_TYPES);

  return apiCallWrapper(getNodeTypesAPI, {
    Icon: true,
    Tree: true,
    Count: 100000,
  });
};
