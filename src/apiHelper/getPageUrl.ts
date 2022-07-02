import {
  PROFILE_USER,
  NODE_PATH,
  CLASSES_WITHID_PATH,
} from 'constant/constants';

export const getProfilePageUrl = (userID: string) => {
  return `/${PROFILE_USER}${userID && `/${userID}`}`;
};

export const getNodePageUrl = (NodeID: string) => {
  return `${NODE_PATH.replace(':id', NodeID)}`;
};

export const getClassesPageUrl = (ClassID: string, RelatedNodeID?: string) => {
  return `${CLASSES_WITHID_PATH.replace(':id', ClassID)}${
    RelatedNodeID ? `?relatedNodeID=${RelatedNodeID}` : ''
  }`;
};
