import {
  API_Provider,
  decodeBase64,
  encodeBase64,
  // getCaptchaToken,
} from 'helpers/helpers';

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
  FG_API,
  GET_FORM_ELEMENTS,
  GET_CHILD_NODES,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  CROP_PROFILE_IMAGE,
  CHANGE_PASSWORD,
  GET_PASS_POLICY,
  CHECK_USER_NAME,
  SET_USER_NAME,
  SET_PASSWORD_RESET_TICKET,
  SET_PASSWORD,
  MODIFY_EMAIL_TICKET,
  MODIFY_EMAIL,
  SAVE_USER_SETTINGS_ITEM,
  SET_VERIFICATION_CODE_MEDIA,
  GET_TEMPLATES,
  GET_CHILD_NODE_TYPES,
  ADD_NODE_TYPE,
  REMOVE_NODE_TYPE,
  RECOVER_NODE_TYPE,
  GET_NODE_TYPES,
  GET_TEMPLATES_JSON,
  ACTIVATE_TEMPLATE,
  GET_TEMPLATE_TAGS,
  SAVE_APPLICATION_INFO,
  SEARCH_API,
  SEARCH,
  GET_APPLICATION_MONITORING,
} from 'constant/apiConstants';
const { GlobalUtilities } = window;

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
 * @param {Object} cropArea
 * @returns Promise.
 */
export const cropIcon = (id, type, cropArea) => {
  const cropIconAPI = API_Provider(DOCS_API, CROP_ICON);
  const { x: X, y: Y, width: Width, height: Height } = cropArea;
  console.log(cropArea);

  return new Promise((resolve, reject) => {
    try {
      cropIconAPI.fetch(
        {
          IconID: id,
          Type: type,
          X,
          Y,
          Width,
          Height,
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
 * @description Crop profile image.
 * @param {String} id
 * @param {Object} cropArea
 * @returns Promise.
 */
export const cropProfileImage = (id, cropArea) => {
  const cropProfileImageAPI = API_Provider(DOCS_API, CROP_PROFILE_IMAGE);
  const { x: X, y: Y, width: Width, height: Height } = cropArea;
  console.log(cropArea);

  return new Promise((resolve, reject) => {
    try {
      cropProfileImageAPI.fetch(
        {
          UserID: id,
          X,
          Y,
          Width,
          Height,
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
 *  @param {String} numberType -Type of the phone number.
 *  @returns Promise.
 */
export const setPhoneNumber = (userId, phoneNumber, numberType = 'Mobile') => {
  const setPhoneNumberAPI = API_Provider(USERS_API, SET_PHONE_NUMBER);

  return new Promise((resolve, reject) => {
    try {
      setPhoneNumberAPI.fetch(
        {
          UserID: userId,
          PhoneNumber: encodeBase64(phoneNumber),
          PhoneNumberType: numberType,
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
 *  @param {String} numberType -Type of the phone number.
 *  @returns Promise.
 */
export const editPhoneNumber = (
  numberId,
  phoneNumber,
  numberType = 'Mobile'
) => {
  const editPhoneNumberAPI = API_Provider(USERS_API, EDIT_PHONE_NUMBER);

  return new Promise((resolve, reject) => {
    try {
      editPhoneNumberAPI.fetch(
        {
          NumberID: numberId,
          PhoneNumber: encodeBase64(phoneNumber),
          PhoneNumberType: numberType,
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

/**
 * @description Get form elements.
 *  @param {String} formId -The id of the form.
 *  @param {String} ownerId -The id of the form owner.
 *  @param {Boolean} [elementsLimits]
 *  @returns Promise.
 */
export const getFormElements = (formId, ownerId, elementsLimits = false) => {
  const getFormElementsAPI = API_Provider(FG_API, GET_FORM_ELEMENTS);

  return new Promise((resolve, reject) => {
    try {
      getFormElementsAPI.fetch(
        {
          FormID: formId,
          OwnerID: ownerId,
          ConsiderElementsLimits: elementsLimits,
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
 * @description Get child nodes.
 *  @param {String} nodeTypeId -The id of the node type.
 *  @param {String} nodeId -The id of the node.
 *  @returns Promise.
 */
export const getChildNodes = (nodeTypeId, nodeId = '') => {
  const getChildNodesAPI = API_Provider(CN_API, GET_CHILD_NODES);

  return new Promise((resolve, reject) => {
    try {
      getChildNodesAPI.fetch(
        {
          NodeTypeID: nodeTypeId,
          NodeID: nodeId,
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
 * @description Set user first name.
 *  @param {String} userId -The id of the user.
 *  @param {String} firstName -The first name of the user.
 *  @returns Promise.
 */
export const setFirstName = (userId = '', firstName) => {
  const setFirstNameAPI = API_Provider(USERS_API, SET_FIRST_NAME);

  return new Promise((resolve, reject) => {
    try {
      setFirstNameAPI.fetch(
        {
          UserID: userId,
          FirstName: encodeBase64(firstName),
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
 * @description Set user last name.
 *  @param {String} userId -The id of the user.
 *  @param {String} lastName -The last name of the user.
 *  @returns Promise.
 */
export const setLastName = (userId = '', lastName) => {
  const setLastNameAPI = API_Provider(USERS_API, SET_LAST_NAME);

  return new Promise((resolve, reject) => {
    try {
      setLastNameAPI.fetch(
        {
          UserID: userId,
          LastName: encodeBase64(lastName),
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
 * @description Change user password.
 *  @param {String} userId -The id of the user.
 *  @param {String} currentPassword -The current password of the user.
 *  @param {String} newPassword -The new password of the user.
 *  @returns Promise.
 */
export const changeUserPassword = (userId, currentPassword, newPassword) => {
  const changeUserPasswordAPI = API_Provider(USERS_API, CHANGE_PASSWORD);

  return new Promise((resolve, reject) => {
    try {
      changeUserPasswordAPI.fetch(
        {
          UserID: userId,
          CurrentPassword: encodeBase64(currentPassword),
          NewPassword: encodeBase64(newPassword),
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
 * @description Get password policy.
 * @returns Promise.
 */
export const getPasswordPolicy = () => {
  const getPasswordPolicyAPI = API_Provider(USERS_API, GET_PASS_POLICY);

  return new Promise((resolve, reject) => {
    try {
      getPasswordPolicyAPI.fetch(
        {},
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
 * @description Check userName.
 * @param {String} userName -The userName.
 * @returns Promise.
 */
export const checkUserName = (userName) => {
  const checkUserNameAPI = API_Provider(USERS_API, CHECK_USER_NAME);

  return new Promise((resolve, reject) => {
    try {
      checkUserNameAPI.fetch(
        { UserName: decodeBase64(userName) },
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
 * @description Change userName.
 * @param {String} userId -The user id.
 * @param {String} userName -The userName.
 * @returns Promise.
 */
export const changeUserName = (userId, userName) => {
  const setUserNameAPI = API_Provider(USERS_API, SET_USER_NAME);

  return new Promise((resolve, reject) => {
    try {
      setUserNameAPI.fetch(
        { UserID: userId, UserName: decodeBase64(userName) },
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
 * @description Reset user password.
 * @param {String} email -The user email.
 * @param {String} password -The user new password.
 * @param {String} captchaToken -The captcha token.
 * @returns Promise.
 */
export const resetUserPassword = (email, password, captchaToken) => {
  const resetUserPasswordAPI = API_Provider(
    USERS_API,
    SET_PASSWORD_RESET_TICKET
  );

  return new Promise((resolve, reject) => {
    try {
      resetUserPasswordAPI.fetch(
        {
          UserName: encodeBase64(GlobalUtilities.secure_string(email)),
          Password: password,
          Captcha: captchaToken,
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
 * @description Set user password.
 * @param {String} code -The code that has been send to user.
 * @param {String} confirmationToken -The confirmation token.
 * @returns Promise.
 */
export const setUserPassword = (code, confirmationToken) => {
  const setUserPasswordAPI = API_Provider(USERS_API, SET_PASSWORD);

  return new Promise((resolve, reject) => {
    try {
      setUserPasswordAPI.fetch(
        {
          VerificationToken: confirmationToken,
          Code: code,
          Login: true,
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
 * @description Reset user email.
 * @param {String} emailId -The user email id.
 * @param {String} Address -The user email address.
 * @param {String} captchaToken -The captcha token.
 * @returns Promise.
 */
export const resetUserEmail = (emailId, Address, captchaToken) => {
  const resetUserEmailAPI = API_Provider(USERS_API, MODIFY_EMAIL_TICKET);

  return new Promise((resolve, reject) => {
    try {
      resetUserEmailAPI.fetch(
        {
          EmailID: emailId,
          Address: encodeBase64(Address),
          Captcha: captchaToken,
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
 * @description Modify user email.
 * @param {String} code -The code that has been send to user.
 * @param {String} confirmationToken -The confirmation token.
 * @returns Promise.
 */
export const modifyUserEmail = (code, confirmationToken) => {
  const modifyUserEmailAPI = API_Provider(USERS_API, MODIFY_EMAIL);

  return new Promise((resolve, reject) => {
    try {
      modifyUserEmailAPI.fetch(
        {
          VerificationToken: confirmationToken,
          Code: code,
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
 * @description Save user settings item.
 * @param {String} name -The name of the setting item.
 * @param {String | Number | Boolean} value -The value of the setting item.
 * @returns Promise.
 */
export const saveUserSettings = (name, value) => {
  const saveUserSettingsAPI = API_Provider(USERS_API, SAVE_USER_SETTINGS_ITEM);

  const normalizedValue =
    GlobalUtilities.get_type(value) === 'string' ? encodeBase64(value) : value;

  return new Promise((resolve, reject) => {
    try {
      saveUserSettingsAPI.fetch(
        {
          Name: name,
          Value: normalizedValue,
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
 * @description Set verification code media.
 * @param {String} media -The media type.
 * @returns Promise.
 */
export const setVerificationCodeMedia = (media = '') => {
  const setVerificationCodeMediaAPI = API_Provider(
    USERS_API,
    SET_VERIFICATION_CODE_MEDIA
  );

  return new Promise((resolve, reject) => {
    try {
      setVerificationCodeMediaAPI.fetch(
        {
          Media: media,
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
 * @description Get gallery templates.
 * @param {String} tagId -The id of tag for template(empty to get all).
 * @returns Promise.
 */
export const getTemplates = (tagId = '') => {
  const getTemplatesAPI = API_Provider(CN_API, GET_TEMPLATES);

  return new Promise((resolve, reject) => {
    try {
      getTemplatesAPI.fetch(
        {
          TagID: tagId,
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
 * @description Get gallery templates JSON.
 * @param {String} nodeId -The id of node type.
 * @returns Promise.
 */
export const getTemplatesJSON = (nodeId) => {
  const getTemplatesJSONAPI = API_Provider(CN_API, GET_TEMPLATES_JSON);

  return new Promise((resolve, reject) => {
    try {
      getTemplatesJSONAPI.fetch(
        {
          NodeTypeID: nodeId,
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
 * @description Activate a template.
 * @param {any} template -The template to be activated.
 * @returns Promise.
 */
export const activateTemplate = (template) => {
  const activateTemplateAPI = API_Provider(CN_API, ACTIVATE_TEMPLATE);

  return new Promise((resolve, reject) => {
    try {
      activateTemplateAPI.fetch(
        {
          Template: template,
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
 * @description Get node types.
 * @param {String} nodeTypeId -The id of node.
 * @param {String} count -The number of nodes to fetch.
 * @param {Boolean} archive - Get archives or not? .
 * @returns Promise.
 */
export const getChildNodeTypes = (
  nodeTypeId = '',
  count = '',
  archive = false
) => {
  const getChildNodeTypesAPI = API_Provider(CN_API, GET_CHILD_NODE_TYPES);

  return new Promise((resolve, reject) => {
    try {
      getChildNodeTypesAPI.fetch(
        {
          NodeTypeID: nodeTypeId,
          Count: count,
          Archive: archive,
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
 * @description Get node types.
 * @param {String} searchText -The text to search for.
 * @param {String} count -The number of nodes to fetch.
 * @param {Boolean} archive - Get archives or not? .
 * @returns Promise.
 */
export const getNodeTypes = (searchText, archive = false, count = '') => {
  const getNodeTypesAPI = API_Provider(CN_API, GET_NODE_TYPES);

  return new Promise((resolve, reject) => {
    try {
      getNodeTypesAPI.fetch(
        {
          Count: count,
          SearchText: encodeBase64(searchText),
          Archive: archive,
          Icon: true,
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
 * @description Add node type.
 * @param {String} name -The name of the node.
 * @param {String} parentId -The id of the parent of the node.
 * @param {Boolean} isCategory - is category or not?.
 * @returns Promise.
 */
export const addNodeType = (name, parentId = '', isCategory = true) => {
  const addNodeTypeAPI = API_Provider(CN_API, ADD_NODE_TYPE);

  return new Promise((resolve, reject) => {
    try {
      addNodeTypeAPI.fetch(
        {
          Name: encodeBase64(name),
          ParentID: parentId,
          IsCategory: isCategory,
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
 * @description Remove node type.
 * @param {String} nodeId -The id of the node.
 * @param {Boolean} hierarchy - Should remove hierarchy or not?.
 * @returns Promise.
 */
export const removeNodeType = (nodeId, hierarchy = false) => {
  const removeNodeTypeAPI = API_Provider(CN_API, REMOVE_NODE_TYPE);

  return new Promise((resolve, reject) => {
    try {
      removeNodeTypeAPI.fetch(
        {
          NodeTypeID: nodeId,
          RemoveHierarchy: hierarchy,
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
 * @description Recover node type.
 * @param {String} nodeId -The id of the node.
 * @returns Promise.
 */
export const recoverNodeType = (nodeId) => {
  const recoverNodeTypeAPI = API_Provider(CN_API, RECOVER_NODE_TYPE);

  return new Promise((resolve, reject) => {
    try {
      recoverNodeTypeAPI.fetch(
        {
          NodeTypeID: nodeId,
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
 * @description Get field of expertise list
 * @returns {Promise}
 */
export const getTemplateTags = () => {
  const getTemplateTagsAPI = API_Provider(CN_API, GET_TEMPLATE_TAGS);

  return new Promise((resolve, reject) => {
    try {
      getTemplateTagsAPI.fetch(
        {},
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description update the team (application) info
 * @param ApplicationID - the application id
 * @param Title - title of the application
 * @param Tagline - tagline of the application
 * @param Website - website url of the application
 * @param About
 * @param Size
 * @param ExpertiseFieldID
 * @param ExpertiseFieldName
 * @param Language
 * @param Calender
 * @return {Promise<unknown>}
 */
export const saveApplicationInfo = (
  ApplicationID,
  Title,
  Tagline,
  Website,
  About,
  Size,
  ExpertiseFieldID,
  ExpertiseFieldName,
  Language,
  Calendar
) => {
  const saveApplicationInfoAPI = API_Provider(RV_API, SAVE_APPLICATION_INFO);

  return new Promise((resolve, reject) => {
    try {
      saveApplicationInfoAPI.fetch(
        {
          ApplicationID,
          ExpertiseFieldID,
          Language,
          Calendar,
          Title: encodeBase64(Title),
          Tagline: encodeBase64(Tagline),
          Website: encodeBase64(Website),
          About: encodeBase64(About),
          Size: encodeBase64(Size),
          ExpertiseFieldName: encodeBase64(ExpertiseFieldName),
        },
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @typedef ParamsType
 * @type {Object}
 * @property {String} searchText - The text to be searched.
 * @property {String} itemTypes - All the types that should search against them(e.g: 'Node|File').
 * @property {Boolean} [hasTitle]
 * @property {Boolean} [hasDescription]
 * @property {Boolean} [hasContent]
 * @property {Boolean} [hasTags]
 * @property {Boolean} [hasFileContent]
 * @property {String} [typeIds]
 * @property {Boolean} [isExcel]
 * @property {String} [types]
 */

/**
 * Search in almost all the application.
 * @param {ParamsType}
 * @returns {Promise}
 */
export const search = ({
  searchText,
  itemTypes,
  hasTitle = true,
  hasDescription = true,
  hasContent = true,
  hasTags = true,
  hasFileContent = true,
  typeIds = '',
  isExcel = false,
  types = '',
}) => {
  const searchAPI = API_Provider(SEARCH_API, SEARCH);

  return new Promise((resolve, reject) => {
    try {
      searchAPI.fetch(
        {
          SearchText: encodeBase64(searchText),
          ItemTypes: itemTypes,
          Title: hasTitle,
          Description: hasDescription,
          Content: hasContent,
          Tags: hasTags,
          FileContent: hasFileContent,
          TypeIDs: typeIds,
          Types: types,
          Excel: isExcel,
        },
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @typedef ParamsType
 * @type {Object}
 * @property {Boolean} totalUsersCount -
 * @property {Boolean} membersCount -
 * @property {Boolean} lastActivityTime
 * @property {Number} loginsCountSinceNDaysAgo
 * @property {Number} count
 * @property {Number} lowerBoundary
 */

/**
 * @description Get team list.
 * @param {ParamsType}
 * @returns {Promise}
 */
export const GetApplicationsMonitoring = ({
  totalUsersCount = true,
  membersCount = true,
  lastActivityTime = true,
  loginsCountSinceNDaysAgo = 30,
  count,
  lowerBoundary,
}) => {
  const GetApplicationsMonitoringAPI = API_Provider(
    RV_API,
    GET_APPLICATION_MONITORING
  );

  return new Promise((resolve, reject) => {
    try {
      GetApplicationsMonitoringAPI.fetch(
        {
          TotalUsersCount: totalUsersCount,
          MembersCount: membersCount,
          LastActivityTime: lastActivityTime,
          LoginsCountSinceNDaysAgo: loginsCountSinceNDaysAgo,
          Count: count,
          LowerBoundary: lowerBoundary,
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
