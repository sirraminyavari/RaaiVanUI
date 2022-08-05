import { PROFILE_USER, CLASSES_WITHID_PATH } from 'constant/constants';
import {
  NODE_PREVIEW_PATH,
  NODE_CREATE_PATH,
} from 'views/Node/items/others/constants';

export const getProfilePageUrl = (userID: string) => {
  return `/${PROFILE_USER}${userID && `/${userID}`}`;
};

export const getNodePageUrl = (NodeID: string) => {
  return `${NODE_PREVIEW_PATH.replace(':id', NodeID)}`;
};

export const getNewNodePageUrl = (NodeTypeID: string) => {
  return `${NODE_CREATE_PATH.replace(':id', NodeTypeID)}`;
};

export const getClassesPageUrl = (ClassID: string, RelatedNodeID?: string) => {
  return `${CLASSES_WITHID_PATH.replace(':id', ClassID)}${
    RelatedNodeID ? `?RelatedID=${RelatedNodeID}` : ''
  }`;
};
