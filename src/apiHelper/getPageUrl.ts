import {
  PROFILE_USER,
  CLASSES_WITHID_PATH,
  NEWNODE_PATH,
  NODE_PATH,
} from 'constant/constants';

export const getProfilePageUrl = (userID: string) => {
  return `/${PROFILE_USER}${userID && `/${userID}`}`;
};

export const getNodePageUrl = (NodeID: string) => {
  return `${NODE_PATH.replace(':id', NodeID)}`;
};

export const getNewNodePageUrl = (NodeTypeID: string) => {
  return `${NEWNODE_PATH.replace(':id', NodeTypeID)}`;
};

export const getClassesPageUrl = (ClassID: string, RelatedNodeID?: string) => {
  return `${CLASSES_WITHID_PATH.replace(':id', ClassID)}${
    RelatedNodeID ? `?RelatedID=${RelatedNodeID}` : ''
  }`;
};
