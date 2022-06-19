import { PROFILE_USER, NODE_PATH } from 'constant/constants';

export const getProfilePageUrl = (userID: string) => {
  return `/${PROFILE_USER}${userID && `/${userID}`}`;
};

export const getNodePageUrl = (NodeID: string) => {
  return `${NODE_PATH.replace(':id', NodeID)}`;
};
