import { CN_API } from 'constant/apiConstants';
import { API_Provider, encodeBase64 } from 'helpers/helpers';
import { apiCallWrapper } from '../apiCallHelpers';

/**
 * @description fetches the categories of templates
 * @returns Promise.
 */
export const getTemplateTags = () => {
  return apiCallWrapper(API_Provider(CN_API, 'GetTemplateTags'), {});
};

/**
 * @description Get templates.
 * @param {String} [props.TagID] if provided, fetches the templates related to this tag, otherwise fetches all of the templates
 * @returns Promise.
 */
export const getTemplates = ({ TagID }: { TagID?: string } = {}) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetTemplates'), { TagID });
};

/**
 * @description Gets a template object
 * @param {String} prop.NodeTypeID the id of the template
 * @returns Promise.
 */
export const getTemplateJSON = ({ NodeTypeID }) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetTemplateJSON'), {
    NodeTypeID,
  });
};

export const setNodeTypesOrder = ({ NodeTypeIDs }) => {
  return apiCallWrapper(API_Provider(CN_API, 'SetNodeTypesOrder'), {
    NodeTypeIDs: NodeTypeIDs.join('|'),
  });
};

/**
 * @description Activate a template.
 * @param {any} Template -The template object to be activated.
 * @returns Promise.
 */
export const activateTemplate = ({ Template }) => {
  return apiCallWrapper(API_Provider(CN_API, 'ActivateTemplate'), {
    Template: encodeBase64(JSON.stringify(Template || {})),
  });
};

/**
 * @description get the preview of a Template
 * @param {string} NodeTypeID -The template object to be activated.
 * @returns Promise.
 */
export const getTemplatePreview = ({ NodeTypeID }) => {
  return apiCallWrapper(API_Provider(CN_API, 'GetTemplatePreview'), {
    NodeTypeID,
  });
};
