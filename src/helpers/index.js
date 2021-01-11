export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getURL = (url) => window.RVAPI[`${url}PageURL`]().slice(5);