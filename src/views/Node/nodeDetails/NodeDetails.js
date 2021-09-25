/**
 * This page is presenter for Node page
 */

import APIHandler from 'apiHelper/APIHandler';
import React, { useEffect, useState } from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import NodeView from '../Node-view';
import Collector from './items/Collector';
import styled from 'styled-components';

const getNode = new APIHandler('CNAPI', 'GetNode');
const NodeDetails = (props) => {
  const { route } = props || {};
  const { NodeID } = route || {};
  const [nodeDetails, setNodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNode?.fetch({ NodeID: NodeID }, (result) => {
      console.log(result, 'result');
      setNodeDetails(result);
      setLoading(false);
    });
  }, []);
  console.log(props, 'props');
  return (
    <Maintainer style={{ width: '100%' }}>
      {/* If True, will render MobileView component */}

      <>
        {DimensionHelper()?.isTabletOrMobile ? (
          <Collector nodeId={NodeID} nodeDetails={nodeDetails} {...props} />
        ) : (
          <Collector nodeId={NodeID} nodeDetails={nodeDetails} {...props} />
        )}
      </>
      {/* <NodeView {...props} /> */}
    </Maintainer>
  );
};
export default NodeDetails;

const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
`;
