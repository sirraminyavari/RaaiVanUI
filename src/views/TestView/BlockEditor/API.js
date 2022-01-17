import { API_Provider } from 'helpers/helpers';
import { apiCallWrapper } from 'apiHelper/ApiHandlers/apiCallHelpers';

const { Base64 } = window;

export const getWikiBlocks = async ({ ownerId }) => {
  return await apiCallWrapper(API_Provider('WikiAPI', 'GetWikiBlocks'), {
    OwnerID: ownerId,
  });
};

export const saveBlocks = async ({ ownerId, content, insertAfterKey } = {}) => {
  return await apiCallWrapper(API_Provider('WikiAPI', 'SaveBlocks'), {
    OwnerID: ownerId,
    Content: Base64.encode(JSON.stringify(content || {})),
    InsertAfterKey: insertAfterKey,
  });
};

export const removeBlocks = async ({ ownerId, content } = {}) => {
  return await apiCallWrapper(API_Provider('WikiAPI', 'RemoveBlocks'), {
    OwnerID: ownerId,
    Content: Base64.encode(JSON.stringify(content || {})),
  });
};

export const sortBlocks = async ({ ownerId, content } = {}) => {
  return await apiCallWrapper(API_Provider('WikiAPI', 'SortBlocks'), {
    OwnerID: ownerId,
    Content: Base64.encode(JSON.stringify(content || {})),
  });
};

export const saveHTMLContent = async ({ ownerId, html, css } = {}) => {
  return await apiCallWrapper(API_Provider('WikiAPI', 'SaveHTMLContent'), {
    OwnerID: ownerId,
    HTML: Base64.encode(html),
    CSS: Base64.encode(css),
  });
};

export const suggestTags = async ({ text, count = 10 } = {}) => {
  const result = await apiCallWrapper(API_Provider('RVAPI', 'SuggestTags'), {
    SearchText: Base64.encode(text),
    Count: count,
  });

  return (result?.Items || [])
    .map((item) => ({
      ItemID: item.ItemID,
      Name: Base64.decode(item.Name),
      Type: item.Type,
      AdditionalID: Base64.decode(item.AdditionalID),
      ImageURL: item.ImageURL,
    }))
    .filter((itm, ind) => ind < count);
};
