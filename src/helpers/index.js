// Capitalize strings for react friendly styles
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Get route path from api
export const getURL = (url, params = {}) =>
  window.RVAPI[`${url}PageURL`](params).slice(5);

// Check if an object is empty or not
export const isEmpty = (obj) => {
  return !(Object.keys(obj).length !== 0 && obj.constructor === Object);
};
