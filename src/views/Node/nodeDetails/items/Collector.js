/**
 * A component for advanced searching
 */
import {
  getFormInstance,
  initializeOwnerFormInstance,
} from 'apiHelper/ApiHandlers/FGAPI/FGAPI';
import { useState, lazy, Suspense, useEffect } from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import {
  Container,
  Maintainer,
  Scrollable,
  ScrollProvider,
  TopFilter,
  Side,
  Space,
} from '../NodeDetails.style';
import FieldsLoadingSkelton from './FieldsLoadingSkelton';
import MainNode from './MainNode';
import TopBar from './topBar/TopBar';
import BlockEditor from 'components/BlockEditor/Block';

const SideColumn = lazy(() =>
  import(
    /* webpackChunkName: "node-page-side-column"*/ './sideColumn/SideColumn'
  )
);

const { RV_RTL, RV_RevFloat } = window;
/**
 *
 * @param {Component} children - the componet that renders inside AdvancedSearchComponent
 * @param {String} nodeTypeId - required for fetching node list
 */
const Collector = ({
  itemSelectionMode,
  nodeDetails,
  nodeId,
  hierarchy,
  ...props
}) => {
  const [sideColumn, setSideColumn] = useState(false);
  const [fields, setFields] = useState(null);
  const isTabletOrMobile = DimensionHelper()?.isTabletOrMobile;

  useEffect(() => {
    (async () => {
      const { InstanceID } = await initializeOwnerFormInstance({
        OwnerID: nodeId,
      });
      const formInstance = await getFormInstance({
        InstanceID: InstanceID,
        LimitOwnerID: null,
        ShowAllIfNoLimit: true,
      });
      console.log({ formInstance });

      setFields(formInstance);
    })();
  }, [nodeId]);

  return (
    <Container
      isAdvancedShow={false}
      className={'rv-bg-color-white'}
      RV_RTL={RV_RTL}
    >
      <ScrollProvider
        className={`${'rv-bg-color-white'} rv-border-radius-half`}
        isAdvancedShow={sideColumn}
      >
        <Scrollable isAdvancedShow={sideColumn}>
          <Maintainer
            isAdvancedShow={sideColumn}
            className={`${'rv-bg-color-white'} rv-border-radius-half`}
            fullWidth={sideColumn}
          >
            {/* <LoadingSkelton /> */}
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
                padding: '0 3.5rem 3.5rem',
                maxWidth: '100%',
                overflow: 'hidden',
              }}
              {...props}
            >
              {fields ? (
                <MainNode
                  nodeDetails={nodeDetails}
                  nodeId={nodeId}
                  fields={fields}
                  {...props}
                />
              ) : (
                <FieldsLoadingSkelton />
              )}
            </div>
          </Maintainer>
          <BlockEditor nodeId={nodeId} />
        </Scrollable>
      </ScrollProvider>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!itemSelectionMode && (
          <Space
            $isEnabled={sideColumn}
            dir={RV_RevFloat}
            rtl={RV_RTL}
            mobileView={isTabletOrMobile}
          />
        )}
        <Side $isEnabled={sideColumn} dir={RV_RevFloat} rtl={RV_RTL}>
          <Suspense fallback={<></>}>
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
export default Collector;
