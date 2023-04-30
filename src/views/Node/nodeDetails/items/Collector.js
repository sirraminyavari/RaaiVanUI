/**
 * A component for advanced searching
 */
import { getFormInstance } from 'apiHelper/ApiHandlers/FGAPI/FGAPI';
import { useState, lazy, Suspense, useEffect } from 'react';
import { Maintainer, TopFilter, Side } from '../NodeDetails.style';
import FieldsLoadingSkelton from './FieldsLoadingSkelton';
import MainNode from './MainNode';
import TopBar from './topBar/TopBar';
import WelcomeLayout from 'layouts/WelcomeLayout';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const SideColumn = lazy(() =>
  import(
    /* webpackChunkName: "node-page-side-column"*/ './sideColumn/SideColumn'
  )
);

const { RV_RTL } = window;
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
  InstanceID,
  newNode = false,
  contribution,
  ...props
}) => {
  const { isTabletOrMobile } = DimensionHelper();
  const [sideColumn, setSideColumn] = useState(false);
  const [fields, setFields] = useState(null);

  useEffect(() => {
    (async () => {
      if (newNode) {
        const formInstance = await getFormInstance({
          InstanceID: InstanceID,
          LimitOwnerID: null,
          ShowAllIfNoLimit: true,
        });
        console.log({ formInstance });

        setFields(formInstance);
      } else {
        setFields(nodeDetails);
      }
      const formInstance = newNode
        ? nodeDetails
        : InstanceID
        ? await getFormInstance({
            InstanceID: InstanceID,
            LimitOwnerID: null,
            ShowAllIfNoLimit: true,
          })
        : nodeDetails;
      console.log({ formInstance });

      setFields(formInstance);
    })();
  }, [InstanceID, nodeDetails, newNode]);

  return (
    <Maintainer
      isAdvancedShow={sideColumn}
      // className={`${'rv-bg-color-white'} rv-border-radius-half`}
      portalMode={!isTabletOrMobile}
    >
      <WelcomeLayout centerize noOutline>
        <>
          <div
            style={{
              // padding: '0 3.5rem 3.5rem',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
            {...props}
          >
            <TopFilter>
              <TopBar
                newNode={newNode}
                onSideColumnClicked={setSideColumn}
                sideColumn={sideColumn}
                nodeDetails={nodeDetails}
                hierarchy={hierarchy}
                contribution={contribution}
              />
            </TopFilter>
            {fields ? (
              <MainNode
                nodeDetails={nodeDetails}
                nodeId={nodeId}
                fields={fields}
                InstanceID={InstanceID}
                newNode={newNode}
                NodeTypeID={nodeId}
                {...props}
              />
            ) : (
              <FieldsLoadingSkelton />
            )}
          </div>
        </>
      </WelcomeLayout>
      {!newNode && (
        <Side
          $isEnabled={sideColumn}
          isRtl={RV_RTL}
          portalMode={isTabletOrMobile}
        >
          <Suspense fallback={<></>}>
            {sideColumn && (
              <SideColumn
                setSideColumn={setSideColumn}
                nodeDetails={nodeDetails}
              />
            )}
          </Suspense>
        </Side>
      )}
    </Maintainer>
  );
};
export default Collector;
