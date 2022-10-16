/**
 * Renders header for node age side.
 */
import { useCallback, useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import useWindow from 'hooks/useWindowContext';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import { TCV_DEFAULT, CV_RED } from 'constant/CssVariables';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import TrashIcon from 'components/Icons/TrashIcon';
import { removeNode, recycleNode } from 'apiHelper/apiFunctions';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { useHistory } from 'react-router-dom';
import { SideContext } from './SideColumn';
import { getClassesPageUrl, getNodePageUrl } from 'apiHelper/getPageUrl';

const SideHeader = () => {
  const history = useHistory();
  const { RVDic } = useWindow();

  const { handleCloseSide, nodeDetails } = useContext(SideContext);

  const { NodeID, NodeTypeID } = nodeDetails || {};

  /**
   * Make an info toast.
   * @param {string} message -Toast message
   * @param {('info' | 'error')} type -Toast type
   */
  const makeInfoToast = (message, type) => {
    return InfoToast({
      autoClose: true,
      type,
      message,
      toastId: `node-page-info-${NodeID}`,
    });
  };

  //! Recover node.
  const handleRecycleNode = useCallback(() => {
    //! API call to recycle document.
    recycleNode(NodeID)
      .then((response) => {
        if (response?.Succeed) {
          //! Dispatch success toast.
          const successMSG = 'سند با موفقیت بازیافت شد';
          makeInfoToast(successMSG, 'error');

          history.push(getNodePageUrl(NodeID));
        }
      })
      .catch((error) => {
        //! Dispatch error toast.
        makeInfoToast(error.message, 'error');
      });
  }, [NodeID]);

  //! Remove node.
  const handleRemoveDoc = useCallback(() => {
    //! API call to remove document.
    removeNode(NodeID)
      .then((response) => {
        if (response?.Succeed) {
          //! Dispatch undo toast.
          const deleteMSG = 'سند حذف خواهد شد';

          UndoToast({
            type: 'error',
            autoClose: 10000,
            message: deleteMSG,
            onUndo: handleRecycleNode,
            toastId: `node-page-remove-${NodeID}`,
          });
          history.push(getClassesPageUrl(NodeTypeID));
        }

        if (response?.ErrorText) {
          //! Dispatch error toast.
          const errorMSG =
            RVDic.MSG[response?.ErrorText] || response?.ErrorText;
          makeInfoToast(errorMSG, 'error');
        }
      })
      .catch((error) => {
        console.log(error);
        //! Dispatch error toast.
        makeInfoToast(error.message, 'error');
      });
  }, [NodeTypeID]);

  //! Provide action for header.
  const Actions = () => {
    return (
      <Styled.SideActionItemWrapper
        onClick={handleRemoveDoc}
        style={{ color: CV_RED }}
      >
        <TrashIcon size={15} />
        <div>{RVDic.RemoveN.replace('[n]', 'آیتم')}</div>
      </Styled.SideActionItemWrapper>
    );
  };

  return (
    <Styled.SideColumnHeader>
      <ToolTip
        tipId="side-more-action"
        clickable
        multiline
        effect="solid"
        event="click"
        place="left"
        type="dark"
        className="side-more-action-tooltip"
        arrowColor="transparent"
        offset={{ right: 30, bottom: 15 }}
        renderContent={() => <Actions />}
      >
        <Styled.SideHeaderIconWrapper>
          <MoreIcon size={20} color={TCV_DEFAULT} dir="vertical" />
        </Styled.SideHeaderIconWrapper>
      </ToolTip>
      <Styled.SideHeaderTitle>{RVDic.Info}</Styled.SideHeaderTitle>
      <Styled.SideHeaderIconWrapper onClick={handleCloseSide}>
        <CloseIcon size={18} color={CV_RED} />
      </Styled.SideHeaderIconWrapper>
    </Styled.SideColumnHeader>
  );
};

export default SideHeader;
