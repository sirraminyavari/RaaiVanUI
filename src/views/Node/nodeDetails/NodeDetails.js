/**
 * This page is presenter for Node page
 */

import APIHandler from 'apiHelper/APIHandler';
import React, { useEffect, useState } from 'react';
// import NodeView from '../Node-view';
import Collector from './items/Collector';
// import styled from 'styled-components';
import WelcomeLayout from 'layouts/WelcomeLayout';

export const PropsContext = React.createContext();

const getNode = new APIHandler('CNAPI', 'GetNode');

const NodeDetails = (props) => {
  const { route } = props || {};
  const { NodeID } = route || {};
  const [nodeDetails, setNodeDetails] = useState(null);

  useEffect(() => {
    getNode?.fetch({ NodeID: NodeID }, (result) => {
      setNodeDetails(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PropsContext.Provider value={props}>
      <>
        {/* If True, will render MobileView component */}
        <Collector
          nodeId={NodeID}
          nodeDetails={nodeDetails}
          hierarchy={route?.Hierarchy || []}
          {...props}
        />
        {/* <NodeView {...props} /> */}
      </>
    </PropsContext.Provider>
  );
};
export default NodeDetails;

// const Maintainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   background: red;
// `;
