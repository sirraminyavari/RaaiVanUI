import React, { useState } from 'react';
import { IUseApiItem } from './useApi';

/**
 * @description use this hook to call a list of API functions respectively.
 * the hook unsubscribes immediately after the component unmounts
 * @param {array} apiItems an array of API items each containing an 'apiCall' function and a 'defaultValue' parameter
 * @param {function} apiCall a function that calls the API and returns the returned Promise
 * this function gets an array of results from previous API items
 * @param {function} parser a function that parsers the response of the API
 * @param {any} defaultValue optional. the default result of the API
 * @param {any[]} deps the dependencies of the hook
 *
 * example usage:
 *
 * const { [nodeTypesResult, nodesResult, infoResult], isPending } = useApiChain([
 *  {
 *    apiCall: () => API.CN.getNodeTypes()
 *  },
 *  {
 *    apiCall: ([nodeTypesResult]) => API.CN.getNodes({ NodeTypeID: nodeTypesResult.NodeTypes[0].NodeTypeID }),
 *    defaultValue: [],
 *  },
 *  {
 *    apiCall: ([nodeTypesResult, nodesResult]) => API.CN.getNodeInfo({ NodeID: nodesResult.Nodes[0].NodeID, Description: true }),
 *    defaultValue: { Description: "" }
 *  }
 * ], [])
 */
export const useApiChain = (apiItems: IUseApiItem[], deps: any[]) => {
  const [value, setValue] = useState<any[]>(
    apiItems.map((itm) => itm.defaultValue)
  );

  const [isPending, setIsPending] = useState<boolean>(false);

  React.useEffect(() => {
    let isSubscribed = true;

    setValue(apiItems.map((itm) => itm.defaultValue));
    setIsPending(false);

    const apiList = [...apiItems];
    const apiResults = [...apiItems.map((itm) => itm.defaultValue)];

    const call = async () => {
      const index = apiItems.length - apiList.length;

      const apiItem = !apiList.length ? null : apiList.shift();

      const promise = !apiItem ? null : apiItem.apiCall(apiResults);

      if (!!promise && isSubscribed) {
        if (!isPending) setIsPending(true);

        const res = apiItem?.parser
          ? apiItem.parser(await promise)
          : await promise;

        apiResults[index] = res;

        if (isSubscribed)
          setValue(apiResults.map((val, ind) => (ind === index ? res : val)));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        call();
      } else setIsPending(false);
    };

    call();

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { value, isPending };
};
