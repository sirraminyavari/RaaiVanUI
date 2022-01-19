/**
 * @description a wrapper which create promise object for a certain api call
 * @param api
 * @param data
 * @return {Promise<unknown>}
 */
export const apiCallWrapper = (api, data, { parser } = {}) => {
  return new Promise((resolve, reject) => {
    try {
      api?.fetch(
        data,
        (res) => {
          resolve(typeof parser == 'function' ? parser(res) : res);
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
