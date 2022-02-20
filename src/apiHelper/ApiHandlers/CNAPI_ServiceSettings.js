import { API_Provider, encodeBase64 } from 'helpers/helpers';
import { CN_API } from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';
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

/**
 * @description fetches the current settings of the service
 * @param {string} NodeTypeID the id of a class/template
 */
export const getService = ({ NodeTypeID } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_GET_SERVICE), {
    NodeTypeID,
  });
};

/**
 * @description sets the description of a service
 * @param {string} NodeTypeID the id of a class/template
 * @param {string} Description the description of the service
 */
export const setServiceDescription = ({ NodeTypeID, Description } = {}) => {
  return apiCallWrapper(
    API_Provider(CN_API, API_NAME_CN_SET_SERVICE_DESCRIPTION),
    {
      NodeTypeID,
      Description: encodeBase64(Description),
    }
  );
};

/**
 * @description gets the list of extensions of a NodeType
 * @param {string} NodeTypeID the id of a class/template
 * @param {boolean} Initialize if true, initializes the extensions of the class.
 * set this parameter to true only if you want to edit the extensions
 */
export const getExtensions = ({ NodeTypeID, Initialize } = {}) => {
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
export const enableExtension = ({ NodeTypeID, Name } = {}) => {
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
export const disableExtension = ({ NodeTypeID, Name } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_DISABLE_EXTENSION), {
    OwnerID: NodeTypeID,
    Extension: Name,
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
export const isCommunityPage = ({ NodeTypeID, NodeID, Value } = {}) => {
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
export const enableComments = ({ NodeTypeID, NodeID, Value } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_COMMENTS), {
    NodeTypeID,
    NodeID,
    Value,
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
export const enableContribution = ({ NodeTypeID, NodeID, Value } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_CONTRIBUTION), {
    NodeTypeID,
    NodeID,
    Enable: Value,
  });
};

/**
 * @description you can use this API in two ways:
 * 1. get the current state of 'EnablePreviousVersionSelect' based on NodeTypeID or NodeID.
 *    If you want to use the API this way, you must leave the 'Value' to be null or undefined
 * 2. set the state of 'EnablePreviousVersionSelect'. This usage requires both 'NodeTypeID' and 'Value'
 * @param {string} NodeTypeID the id of the class/template
 * @param {string} NodeID the id of the item
 * @param {boolean} Value the value of the 'EnablePreviousVersionSelect' state
 */
export const enableVersioning = ({ NodeTypeID, NodeID, Value } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, API_NAME_CN_ENABLE_VERSIONING), {
    NodeTypeID,
    NodeID,
    Value,
  });
};
