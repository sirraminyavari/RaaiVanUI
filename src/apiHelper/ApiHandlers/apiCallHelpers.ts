interface IAPICallOptions {
  parser?: any;
}

/**
 * @description a wrapper which create promise object for a certain api call
 * @param api
 * @param data
 */
export const apiCallWrapper = <T = unknown>(
  api: any,
  data: any = {},
  { parser }: IAPICallOptions = {}
): Promise<T & { error?: unknown }> => {
  return new Promise((resolve, _reject) => {
    try {
      api?.fetch(
        data,
        (res: T | PromiseLike<T>) => {
          resolve(typeof parser == 'function' ? parser(res) : res);
        },
        (err: unknown) => {
          console.error(err);
          //@ts-ignore
          resolve({ error: err });
          //reject(err);
        }
      );
    } catch (err) {
      console.error(err);
      //@ts-ignore
      resolve({ error: err });
      //reject(err);
    }
  });
};
