/**
 * Here we produce a part of NodeDetails that relates to side column
 */
import { useRef, useState, createContext } from 'react';
import { BG_GRAY_LIGHT } from 'constant/Colors';
import { BO_RADIUS_HALF } from 'constant/constants';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import SideHeader from './SideHeader';
import SideInfo from './SideInfo';
import SideHistoryLog from './SideHistoryLog';
import SideSetting from './SideSetting';
import SideSecurity from './SideSecurity';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import usePreventScroll from 'hooks/usePreventScroll';
import Modal from 'components/Modal/Modal';
import LogTimeLine from './LogTimeLine';
import Setting from './Setting';
import Security from './Security';
// import useWindow from 'hooks/useWindowContext';

export const SideContext = createContext({});

const MODAL_CONTENTS = {
  history: 'history',
  setting: 'setting',
  security: 'security',
};

const MODAL_DEFAULT = {
  isShown: false,
  title: '',
  content: null,
};

const SideColumn = (props) => {
  const { setSideColumn, nodeDetails } = props;
  const containerRef = useRef();
  const [sideModal, setSideModal] = useState(MODAL_DEFAULT);
  // const { RVDic } = useWindow();

  // console.log({ nodeDetails });

  usePreventScroll(containerRef);

  const handleCloseSide = () => {
    setSideColumn && setSideColumn(false);
  };

  const onModalClose = () => {
    setSideModal(MODAL_DEFAULT);
  };

  const getModalContent = () => {
    switch (sideModal.content) {
      case MODAL_CONTENTS.history:
        return <LogTimeLine />;

      case MODAL_CONTENTS.setting:
        return <Setting />;

      case MODAL_CONTENTS.security:
        return <Security />;

      default:
        return null;
    }
  };

  return (
    <SideContext.Provider
      value={{ nodeDetails, handleCloseSide, setSideModal }}>
      <Styled.SideColumnMaintainer
        ref={containerRef}
        className={`${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`}>
        <Modal
          contentWidth="33%"
          contentClass="node-page-side-modal-content"
          titleContainerClass="node-page-side-modal-header"
          show={sideModal.isShown}
          title={sideModal.title}
          onClose={onModalClose}>
          {getModalContent()}
        </Modal>
        <SideHeader />
        <PerfectScrollbar className="node-page-side-scrollbar">
          <SideInfo />
          <SideHistoryLog />
          <SideSetting />
          <SideSecurity />
        </PerfectScrollbar>
      </Styled.SideColumnMaintainer>
    </SideContext.Provider>
  );
};
export default SideColumn;
