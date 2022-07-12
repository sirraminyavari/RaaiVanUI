import React from 'react';

export interface IUseApiItem {
  apiCall: (val?: any[]) => Promise<any> | null | undefined;
  parser?: (val?: any) => any;
  defaultValue?: any;
}

/**
 * @description use this hook to call a single API. the hook unsubscribes immediately after the component unmounts
 * @param {function} apiCall a function that calls the API and returns the returned Promise
 * @param {function} parser a function that parsers the response of the API
 * @param {any} defaultValue optional. the default result of the API
 * @param {any[]} deps the dependencies of the hook
 *
 * example usage:
 *
 * const { value, isPending } = useApi({
 *  apiCall: () => return checkCondition ? API.CN.getNodes() : null,
 *  defaultValue: undefined,
 * }, [])
 */
export const useApi = (
  { apiCall, parser, defaultValue }: IUseApiItem,
  deps: any[]
) => {
  const [state, setState] = React.useState({
    value: defaultValue,
    isPending: false,
  });

  React.useEffect(() => {
    let isSubscribed = true;

    const promise = apiCall();

    if (!!promise) {
      (async () => {
        setState({ ...state, isPending: true });
        const res = await promise;
        if (isSubscribed)
          setState({ value: parser ? parser(res) : res, isPending: false });
      })();
    }

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
};
