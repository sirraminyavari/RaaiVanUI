/**
 * A component for advanced searching
 */
import React, { useState, lazy, Suspense } from 'react';
import {
  Container,
  Maintainer,
  Scrollable,
  ScrollProvider,
  TopFilter,
  Side,
  Space,
} from '../NodeDetails.style';
import MainNode from './MainNode';
import TopBar from './topBar/TopBar';

const SideColumn = lazy(() =>
  import(
    /* webpackChunkName: "node-page-side-column"*/ './sideColumn/SideColumn'
  )
);

const { RVDic, RVGlobal, RV_RTL, RV_RevFloat } = window;
/**
 *
 * @param {Component} children - the componet that renders inside AdvancedSearchComponent
 * @param {String} nodeTypeId - required for fetching node list
 */
const Collctor = ({
  itemSelectionMode,
  nodeDetails,
  nodeId,
  hierarchy,
  ...props
}) => {
  const [relatedNodes, setRelatedNodes] = useState([]);
  const [sideColumn, setSideColumn] = useState(false);

  const isAdvancedSearch = false;
  return (
    <Container
      isAdvancedShow={sideColumn}
      className={'rv-bg-color-white'}
      RV_RTL={RV_RTL}>
      <ScrollProvider
        className={`${'rv-bg-color-white'} rv-border-radius-half`}
        isAdvancedShow={sideColumn}>
        <Scrollable isAdvancedShow={sideColumn}>
          <Maintainer
            isAdvancedShow={sideColumn}
            className={`${'rv-bg-color-white'} rv-border-radius-half`}
            fullWidth={sideColumn}>
            <TopFilter>
              <TopBar
                onSideColumnClicked={setSideColumn}
                sideColumn={sideColumn}
                nodeDetails={nodeDetails}
                hierarchy={hierarchy}
              />
            </TopFilter>
            <div
              style={{
                padding: '0 7.7rem 2rem 7.7rem',
              }}
              {...props}>
              <MainNode nodeDetails={nodeDetails} nodeId={nodeId} {...props} />
            </div>
          </Maintainer>
        </Scrollable>
      </ScrollProvider>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        {!itemSelectionMode && (
          <Space $isEnabled={sideColumn} dir={RV_RevFloat} rtl={RV_RTL} />
        )}
        <Side $isEnabled={sideColumn} dir={RV_RevFloat} rtl={RV_RTL}>
          <Suspense fallback={<div>Loading...</div>}>
            {console.log('render', new Date())}
            {sideColumn && (
              <SideColumn
                setSideColumn={setSideColumn}
                nodeDetails={nodeDetails}
              />
            )}
          </Suspense>
        </Side>
      </div>
    </Container>
  );
};
export default Collctor;
