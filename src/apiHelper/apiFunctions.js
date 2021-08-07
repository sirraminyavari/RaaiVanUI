import { API_Provider, decodeBase64 } from 'helpers/helpers';
import {
  CROP_ICON,
  DOCS_API,
  GET_VARIABLE,
  RV_API,
  SET_VARIABLE,
  USERS_API,
  GET_USER,
  CN_API,
  GET_FAVORITE_NODES_COUNT,
  GET_INTELLECTUAL_PROPERTIES_COUNT,
  GET_RELATED_NODES_ABSTRACT,
} from 'constant/apiConstants';

/**
 * @description Get variable.
 *  @param {string} variableName -The name of the variable that we want to fetch.
 *  @returns Promise.
 */
export const getVariable = (variableName) => {
  const getVariableAPI = API_Provider(RV_API, GET_VARIABLE);

  return new Promise((resolve, reject) => {
    try {
      getVariableAPI.fetch(
        { Name: variableName, ApplicationIndependent: true },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Set variable.
 *  @param {String} variableName -The name of the variable that we want to set.
 *  @param {Object} variableValue -The value of the variable that we want to set.
 *  @returns Promise.
 */
export const setVariable = (variableName, variableValue) => {
  const setVariableAPI = API_Provider(RV_API, SET_VARIABLE);

  return new Promise((resolve, reject) => {
    try {
      setVariableAPI.fetch(
        {
          Name: variableName,
          Value: decodeBase64(JSON.stringify(variableValue)),
          ApplicationIndependent: true,
        },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Crop icon.
 * @param {String} id
 * @param {String} type
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns Promise.
 */
export const cropIcon = (id, type, x, y, width, height) => {
  const cropIconAPI = API_Provider(DOCS_API, CROP_ICON);

  return new Promise((resolve, reject) => {
    try {
      cropIconAPI.fetch(
        {
          IconID: id,
          Type: type,
          X: x,
          Y: y,
          Width: width,
          Height: height,
        },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get user.
 *  @param {String} userId -The Id of the user.
 *  @param {Boolean} getPhones -Gets user phone numbers if is true.
 *  @param {Boolean} getEmails -Gets user emails if is true.
 *  @returns Promise.
 */
export const getUser = (userId = '', getPhones = true, getEmails = true) => {
  const getUserAPI = API_Provider(USERS_API, GET_USER);

  return new Promise((resolve, reject) => {
    try {
      getUserAPI.fetch(
        { UserID: userId, GetPhoneNumbers: getPhones, GetEmails: getEmails },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get user.
 *  @param {String} userId -The Id of the user.
 *  @param {String} nodeTypeId -Node type id.
 *  @param {Boolean} isDoc -Is document or not.
 *  @returns Promise.
 */
export const getFavoriteNodesCount = (
  userId = '',
  nodeTypeId = '',
  isDoc = false
) => {
  const getFavoriteNodesCountAPI = API_Provider(
    CN_API,
    GET_FAVORITE_NODES_COUNT
  );

  return new Promise((resolve, reject) => {
    try {
      getFavoriteNodesCountAPI.fetch(
        { UserID: userId, NodeTypeID: nodeTypeId, IsDocument: isDoc },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get intellectual properties count.
 *  @param {String} userId -The Id of the user.
 *  @returns Promise.
 */
export const getIntellectualPropertiesCount = (userId = '') => {
  const getIntellectualPropertiesCountAPI = API_Provider(
    CN_API,
    GET_INTELLECTUAL_PROPERTIES_COUNT
  );

  return new Promise((resolve, reject) => {
    try {
      getIntellectualPropertiesCountAPI.fetch(
        { UserID: userId },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get related nodes.
 *  @param {String} id -The Id of node.
 *  @returns Promise.
 */
export const getRelatedNodesAbstract = (id) => {
  const getRelatedNodesAbstractAPI = API_Provider(
    CN_API,
    GET_RELATED_NODES_ABSTRACT
  );

  return new Promise((resolve, reject) => {
    try {
      getRelatedNodesAbstractAPI.fetch(
        {
          NodeID: id,
          In: true,
          Out: true,
          InTags: true,
          OutTags: true,
          ParseResults: true,
        },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
