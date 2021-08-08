import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
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
  EDIT_EMAIL_ADDRESS,
  SET_EMAIL_ADDRESS,
  SET_PHONE_NUMBER,
  EDIT_PHONE_NUMBER,
  SET_JOB_TITLE,
  SET_ABOUT_ME,
  SET_ORGANIZATION,
  SET_DEPARTMENT,
  SET_CITY,
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

/**
 * @description Edit email address.
 *  @param {String} emailId -The id of the email.
 *  @param {String} emailAddress -The address of the email.
 *  @returns Promise.
 */
export const editEmailAddress = (emailId, emailAddress) => {
  const editEmailAddressAPI = API_Provider(USERS_API, EDIT_EMAIL_ADDRESS);

  return new Promise((resolve, reject) => {
    try {
      editEmailAddressAPI.fetch(
        {
          EmailID: emailId,
          Address: encodeBase64(emailAddress),
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
 * @description Set email address.
 *  @param {String} userId -The id of the user.
 *  @param {String} emailAddress -The address of the email.
 *  @returns Promise.
 */
export const setEmailAddress = (userId, emailAddress) => {
  const setEmailAddressAPI = API_Provider(USERS_API, SET_EMAIL_ADDRESS);

  return new Promise((resolve, reject) => {
    try {
      setEmailAddressAPI.fetch(
        {
          UserID: userId,
          Address: encodeBase64(emailAddress),
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
 * @description Set phone number.
 *  @param {String} userId -The id of the user.
 *  @param {String} phoneNumber -The phone number.
 *  @returns Promise.
 */
export const setPhoneNumber = (userId, phoneNumber) => {
  const setPhoneNumberAPI = API_Provider(USERS_API, SET_PHONE_NUMBER);

  return new Promise((resolve, reject) => {
    try {
      setPhoneNumberAPI.fetch(
        {
          UserID: userId,
          PhoneNumber: encodeBase64(phoneNumber),
          PhoneNumberType: 'Mobile',
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
 * @description Edit phone number.
 *  @param {String} numberId -The id of the phone number.
 *  @param {String} phoneNumber -The new phone number.
 *  @returns Promise.
 */
export const editPhoneNumber = (numberId, phoneNumber) => {
  const editPhoneNumberAPI = API_Provider(USERS_API, EDIT_PHONE_NUMBER);

  return new Promise((resolve, reject) => {
    try {
      editPhoneNumberAPI.fetch(
        {
          NumberID: numberId,
          PhoneNumber: encodeBase64(phoneNumber),
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
 * @description Set phone number.
 *  @param {String} userId -The id of the user.
 *  @param {String} jobTitle -The job title of the user.
 *  @returns Promise.
 */
export const setJobTitle = (userId, jobTitle) => {
  const setJobTitleAPI = API_Provider(USERS_API, SET_JOB_TITLE);

  return new Promise((resolve, reject) => {
    try {
      setJobTitleAPI.fetch(
        {
          UserID: userId,
          JobTitle: encodeBase64(jobTitle),
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
 * @description Set about me.
 *  @param {String} userId -The id of the user.
 *  @param {String} text -The about me text for user.
 *  @returns Promise.
 */
export const setAboutMe = (userId, text) => {
  const setAboutMeAPI = API_Provider(USERS_API, SET_ABOUT_ME);

  return new Promise((resolve, reject) => {
    try {
      setAboutMeAPI.fetch(
        {
          UserID: userId,
          Text: encodeBase64(text),
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
 * @description Set organization.
 *  @param {String} userId -The id of the user.
 *  @param {String} organization -The organization that user works in.
 *  @returns Promise.
 */
export const setOrganization = (userId, organization) => {
  const setOrganizationAPI = API_Provider(USERS_API, SET_ORGANIZATION);

  return new Promise((resolve, reject) => {
    try {
      setOrganizationAPI.fetch(
        {
          UserID: userId,
          Organization: encodeBase64(organization),
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
 * @description Set department.
 *  @param {String} userId -The id of the user.
 *  @param {String} department -The department that user works in.
 *  @returns Promise.
 */
export const setDepartment = (userId, department) => {
  const setDepartmentAPI = API_Provider(USERS_API, SET_DEPARTMENT);

  return new Promise((resolve, reject) => {
    try {
      setDepartmentAPI.fetch(
        {
          UserID: userId,
          Department: encodeBase64(department),
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
 * @description Set city.
 *  @param {String} userId -The id of the user.
 *  @param {String} city -The city that user lives in.
 *  @returns Promise.
 */
export const setCity = (userId, city) => {
  const setCityAPI = API_Provider(USERS_API, SET_CITY);

  return new Promise((resolve, reject) => {
    try {
      setCityAPI.fetch(
        {
          UserID: userId,
          City: encodeBase64(city),
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
