export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getURL = (url, params={}) =>
  window.RVAPI[`${url}PageURL`](params).slice(5);