import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import useWindow from 'hooks/useWindowContext';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import { TCV_DEFAULT, CV_RED } from 'constant/CssVariables';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import TrashIcon from 'components/Icons/TrashIcon';

const SideHeader = ({ closeSide }) => {
  const { RVDic } = useWindow();

  const handleRemoveDoc = () => {
    //! API call to remove document.
    console.log('remove document');
  };

  const Actions = () => {
    return (
      <Styled.SideActionItemWrapper
        onClick={handleRemoveDoc}
        style={{ color: CV_RED }}>
        <TrashIcon size={15} />
        <div>{RVDic.RemoveN.replace('[n]', RVDic.Document)}</div>
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
        renderContent={() => <Actions />}>
        <Styled.SideHeaderIconWrapper>
          <MoreIcon size={20} color={TCV_DEFAULT} dir="vertical" />
        </Styled.SideHeaderIconWrapper>
      </ToolTip>
      <Styled.SideHeaderTitle>اطلاعات آیتم</Styled.SideHeaderTitle>
      <Styled.SideHeaderIconWrapper onClick={closeSide}>
        <CloseIcon size={18} color={CV_RED} />
      </Styled.SideHeaderIconWrapper>
    </Styled.SideColumnHeader>
  );
};

export default SideHeader;
