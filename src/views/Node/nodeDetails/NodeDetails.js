/**
 * This page is presenter for Node page
 */

import APIHandler from 'apiHelper/APIHandler';
import React, { useContext, useEffect, useState } from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import NodeView from '../Node-view';
import Collector from './items/Collector';
import styled from 'styled-components';

export const PropsContext = React.createContext();

const getNode = new APIHandler('CNAPI', 'GetNode');

const NodeDetails = (props) => {
  const { route } = props || {};
  const { NodeID } = route || {};
  const [nodeDetails, setNodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNode?.fetch({ NodeID: NodeID }, (result) => {
      setNodeDetails(result);
      setLoading(false);
    });
  }, []);

  return (
    <PropsContext.Provider value={props}>
      <Maintainer style={{ width: '100%' }}>
        {/* If True, will render MobileView component */}
        <>
          {DimensionHelper()?.isTabletOrMobile ? (
            <Collector
              nodeId={NodeID}
              nodeDetails={nodeDetails}
              hierarchy={route?.Hierarchy || []}
              {...props}
            />
          ) : (
            <Collector
              nodeId={NodeID}
              nodeDetails={nodeDetails}
              hierarchy={route?.Hierarchy || []}
              {...props}
            />
          )}
        </>
        {/* <NodeView {...props} /> */}
      </Maintainer>
    </PropsContext.Provider>
  );
};
export default NodeDetails;

const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
`;
