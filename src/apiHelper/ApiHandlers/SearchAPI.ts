import { SEARCH, SEARCH_API } from 'constant/apiConstants';
import { API_Provider, encodeBase64 } from 'helpers/helpers';
import { apiCallWrapper } from './apiCallHelpers';

/**
 * @typedef ParamsType
 * @type {Object}
 * @property {String[]} itemTypes - All the types that should search against them(e.g: 'Node|File').

 */

/**
 * Search in almost all the application.
 * @param {ParamsType}
 * @returns {Promise}
 */
export const search = ({
  searchText = '',
  lowerBoundary,
  itemTypes,
  hasTitle = true,
  hasDescription = true,
  hasContent = true,
  hasTags = true,
  hasFileContent = true,
  typeIds = [],
  isExcel = false,
  types = [],
}: {
  searchText?: string;
  lowerBoundary?: number;
  itemTypes?: string[];
  hasTitle?: boolean;
  hasDescription?: boolean;
  hasContent?: boolean;
  hasTags?: boolean;
  hasFileContent?: boolean;
  typeIds?: string[];
  isExcel?: boolean;
  types?: string[];
}) => {
  return apiCallWrapper(API_Provider(SEARCH_API, SEARCH), {
    SearchText: encodeBase64(searchText),
    LowerBoundary: lowerBoundary,
    ItemTypes: (itemTypes || []).join('|'),
    Title: hasTitle,
    Description: hasDescription,
    Content: hasContent,
    Tags: hasTags,
    FileContent: hasFileContent,
    TypeIDs: (typeIds || []).join('|'),
    Types: (types || []).join('|'),
    Excel: isExcel,
    FormDetails: isExcel,
  });
};
