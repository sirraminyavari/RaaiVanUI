interface IAPICallOptions {
  parser?: any;
}

/**
 * @description a wrapper which create promise object for a certain api call
 * @param api
 * @param data
 * @return {Promise<unknown>}
 */
export const apiCallWrapper = (
  api: any,
  data: any = {},
  { parser }: IAPICallOptions = {}
) => {
  return new Promise((resolve, reject) => {
    try {
      api?.fetch(
        data,
        (res) => {
          resolve(typeof parser == 'function' ? parser(res) : res);
        },
        (err) => {
          console.error(err);
          resolve({ error: err });
          //reject(err);
        }
      );
    } catch (err) {
      console.error(err);
      resolve({ error: err });
      //reject(err);
    }
  });
};
