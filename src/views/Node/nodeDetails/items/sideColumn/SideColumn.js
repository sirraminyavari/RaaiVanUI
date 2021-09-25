/**
 * Here we produce a part of NodeDetails that relates to side column
 */
import { useRef } from 'react';
import { BG_GRAY_LIGHT } from 'constant/Colors';
import { BO_RADIUS_HALF } from 'constant/constants';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import SideHeader from './SideHeader';
import SideInfo from './SideInfo';
import SideHistoryLog from './SideHistoryLog';
import SideSetting from './SideSetting';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import usePreventScroll from 'hooks/usePreventScroll';

// import useWindow from 'hooks/useWindowContext';

const SideColumn = (props) => {
  const { setSideColumn } = props;
  const containerRef = useRef();
  // const { RVDic } = useWindow();

  usePreventScroll(containerRef);

  const handleCloseSide = () => {
    setSideColumn && setSideColumn(false);
  };

  return (
    <Styled.SideColumnMaintainer
      ref={containerRef}
      className={`${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`}>
      <SideHeader closeSide={handleCloseSide} />
      <PerfectScrollbar className="node-page-side-scrollbar">
        <SideInfo itemInfo={{}} />
        <SideHistoryLog />
        <SideSetting />
        <SideSetting />
      </PerfectScrollbar>
    </Styled.SideColumnMaintainer>
  );
};
export default SideColumn;
