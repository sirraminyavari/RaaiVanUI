/**
 * This page is presenter for Node page
 */

import API from 'apiHelper';
import { initializeOwnerFormInstance } from 'apiHelper/ApiHandlers/FGAPI/FGAPI';
import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Collector from './items/Collector';

export const PropsContext = React.createContext();

const NodeDetails = (props) => {
  const { route } = props || {};
  const { id: NodeID } = useParams();
  const [nodeDetails, setNodeDetails] = useState(null);
  const [FormInstanceID, setFormInstanceID] = useState();

  useLayoutEffect(() => {
    (async () => {
      console.clear();
      const nodeInstance = await API.CN.getNode({ NodeID });
      setNodeDetails(nodeInstance);
      const { InstanceID } = await initializeOwnerFormInstance({
        OwnerID: NodeID,
      });
      console.log({ nodeInstance });
      setFormInstanceID(InstanceID);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PropsContext.Provider value={props}>
      <>
        <Collector
          nodeId={NodeID}
          InstanceID={FormInstanceID}
          nodeDetails={nodeDetails}
          hierarchy={route?.Hierarchy || []}
          {...props}
        />
      </>
    </PropsContext.Provider>
  );
};
export default NodeDetails;
