/**
 * @description a wrapper which create promise object for a certain api call
 * @param api
 * @param data
 * @return {Promise<unknown>}
 */
export const apiCallWrapper = (api, data) => {
  return new Promise((resolve, reject) => {
    try {
      api?.fetch(
        data,
        (res) => {
          resolve(res);
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
