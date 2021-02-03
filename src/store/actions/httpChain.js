const httpChain = (
  successAction,
  failedAction,
  api,
  params,
  queryString
) => async (dispatch) => {
  let url = RVAPI.ResponseURL + api;
  try {
    if (queryString && queryString[0] == '&')
      queryString = queryString.substring(1);
    if (!successAction()) return url + (!queryString ? '' : '&' + queryString);
    else
      send_post_request(
        url,
        queryString,
        dispatch(successAction()),
        null,
        null,
        null,
        params.ParseResults,
        params
      );
  } catch (error) {
    dispatch(failedAction(error));
  }
};

export default httpChain;
