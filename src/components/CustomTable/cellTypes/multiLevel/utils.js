import { API_Provider } from 'helpers/helpers';
import { CN_API, GET_CHILD_NODES } from 'constant/apiConstants';

export const getNestedItems = (id, level) => {
  const getChildNodesAPI = API_Provider(CN_API, GET_CHILD_NODES);

  let fetchOption = level === 0 ? { NodeTypeID: id } : { NodeID: id };

  return new Promise((resolve, reject) => {
    try {
      getChildNodesAPI.fetch(
        { ...fetchOption },
        (response) => {
          resolve(response.Nodes);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
