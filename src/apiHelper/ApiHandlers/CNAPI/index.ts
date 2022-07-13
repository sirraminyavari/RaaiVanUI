import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import { CN_API } from 'constant/apiConstants';
import { apiCallWrapper } from '../apiCallHelpers';
import * as UserDecoders from 'apiHelper/ApiHandlers/UsersAPI/decoders';
import { IGetChildNodesRequest, IGetNodesRequest } from './types';

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
}: {
  NodeTypeIDs?: string[];
  GrabSubNodeTypes?: boolean;
  SearchText?: string;
  IsKnowledge?: boolean;
  IsDocument?: boolean;
  Archive?: boolean;
  Icon?: boolean;
  Extensions?: string[];
  Count?: number;
  LowerBoundary?: number;
  HasChild?: boolean;
  Tree?: boolean;
  CheckAccess?: boolean;
} = {}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetNodeTypes'), {
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
  return apiCallWrapper(API_Provider(CN_API, 'RenameNodeType'), {
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
}: {
  NodeTypeIDs?: string[];
  NodeTypeID?: string;
  RemoveHierarchy?: boolean;
}) => {
  const ids = NodeTypeIDs?.length
    ? NodeTypeIDs
    : !!NodeTypeID
    ? [NodeTypeID]
    : [];

  return apiCallWrapper(API_Provider(CN_API, 'RemoveNodeType'), {
    NodeTypeIDs: ids,
    RemoveHierarchy,
  });
};

export const recoverNodeType = ({ NodeTypeID }: { NodeTypeID: string }) => {
  return apiCallWrapper(API_Provider(CN_API, 'RecoverNodeType'), {
    NodeTypeID,
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

export const getNodes = (params: IGetNodesRequest) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetNodes'), {
    ...params,
    NodeIDs: (params.NodeIDs || []).join('|'),
    NodeTypeIDs: (params.NodeTypeIDs || []).join('|'),
    RelatedToIDs: (params.RelatedToIDs || []).join('|'),
    CreatorUserIDs: (params.CreatorUserIDs || []).join('|'),
    FormFilters: !params.FormFilters
      ? undefined
      : encodeBase64(JSON.stringify(params.FormFilters)),
    SearchText: encodeBase64(params.SearchText || ''),
  });
};

export const getChildNodes = (params: IGetChildNodesRequest) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetChildNodes'), {
    ...params,
    SearchText: encodeBase64(params.SearchText || ''),
  });
};

export const addNode = ({
  Name,
  NodeTypeID,
  ParentNodeID,
}: {
  Name: string;
  NodeTypeID: string;
  ParentNodeID?: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'AddNode'), {
    NodeTypeID,
    Name: encodeBase64(Name),
    ParentNodeID,
  });
};

export const modifyNodeName = (Name, NodeID) => {
  return apiCallWrapper(API_Provider(CN_API, 'ModifyNodeName'), {
    NodeID,
    Name: encodeBase64(Name),
  });
};

export const moveNode = ({
  NodeIDs,
  ParentID,
}: {
  NodeIDs: string[];
  ParentID?: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'MoveNode'), {
    NodeIDs: NodeIDs.join('|'),
    ParentNodeID: ParentID,
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
  return apiCallWrapper(API_Provider(CN_API, 'GetChildNodeTypes'), {
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
  return apiCallWrapper(API_Provider(CN_API, 'AddNodeType'), {
    Name: encodeBase64(Name),
    ParentID,
    IsCategory,
  });
};

export const moveNodeType = ({
  NodeTypeIDs,
  NodeTypeID,
  ParentID,
}: {
  NodeTypeIDs?: string[];
  NodeTypeID?: string;
  ParentID?: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'MoveNodeType'), {
    ParentID,
    NodeTypeID: NodeTypeID || (NodeTypeIDs || []).join('|'),
  });
};

export const getFavoriteNodesCount = () => {
  return apiCallWrapper(API_Provider(CN_API, 'GetFavoriteNodesCount'), {});
};

export const setAvatar = ({
  ID,
  AvatarName,
}: {
  ID: string;
  AvatarName: string;
}) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetAvatar'), {
    ID,
    AvatarName,
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
    API_Provider(CN_API, 'GetAllFieldsOfActivity'),
    {}
  );
};
