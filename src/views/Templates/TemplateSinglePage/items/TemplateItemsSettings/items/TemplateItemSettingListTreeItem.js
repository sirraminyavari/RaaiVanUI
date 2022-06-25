import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import DragIcon from 'components/Icons/DragIcon/Drag';
import { decodeBase64 } from 'helpers/helpers';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import api from 'apiHelper';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { IoFileTrayFullOutline } from 'react-icons/io5';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import TemplateItemSettingAddNew from './TemplateItemSettingAddNode';
import { useState } from 'react';

const TemplateItemSettingListTreeItem = ({
  provided,
  depth,
  item,
  onCollapse,
  onExpand,
  loadChildrenAndExpand,
  snapshot,
  onAddChild,
}) => {
  const { RV_RTL: rtl, RVDic } = window;
  const { NodeID, CreationDate, AdditionalID, Name, NodeTypeID } =
    item?.data || {};
  const [addItem, setAddItem] = useState(false);

  const styles = {
    textStyle: {
      fontSize: '1rem',
      color: 'var(--rv-color-warm)',
    },
    inputStyle: {
      width: 'fit-content',
      fontSize: '1rem',
      color: 'var(--rv-color-distant)',
      borderBottom: '1px solid var(--rv-color-distant)',
    },
  };

  const handleRenameTitle = async (value) => {
    const { ErrorText } = await api?.CN?.modifyNodeName(value, NodeID);
    if (ErrorText) {
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  const handleCreateNode = async (name) => {
    const { Node, ...rest } = await api?.CN?.addNode({
      Name: name,
      ParentNodeID: NodeID,
      NodeTypeID: NodeTypeID,
    });
    // let childrenObjects = {
    //   [`${Node?.NodeID}`]: {
    //     id: Node?.NodeID,
    //     children: [],
    //     hasChildren: false,
    //     isExpanded: false,
    //     isChildrenLoading: false,
    //     data: { ...Node },
    //   },
    // };
    // const children = [...item?.children, Node?.NodeID];
    // loadChildrenAndExpand({ id: NodeID, children, childrenObjects });
    if (Node) {
      await handleLoadChildren();
    }
    return rest;
  };

  const handleLoadChildren = async () => {
    if (loadChildrenAndExpand) {
      //load children and prepare data
      const { Nodes } = await api?.CN?.getChildNodes({ NodeID });
      let childrenObjects = {};
      Nodes.forEach((x) => {
        childrenObjects = {
          ...childrenObjects,
          [`${x?.NodeID}`]: {
            id: x?.NodeID,
            children: [],
            hasChildren: x?.HasChild,
            isExpanded: false,
            isChildrenLoading: false,
            data: { ...x },
          },
        };
      });

      const children = Object.keys(childrenObjects);

      loadChildrenAndExpand({ id: NodeID, children, childrenObjects });
    }
  };

  const handleExpand = () => {
    if (item?.isExpanded) {
      onCollapse(NodeID);
    } else {
      handleLoadChildren();
    }
  };

  return (
    <>
      <TreeItemRow
        style={{ direction: 'rtl' }}
        ref={provided?.innerRef}
        {...provided.draggableProps}
      >
        <Container {...provided?.dragHandleProps}>
          <TitleBlock {...{ rtl, depth }}>
            <ArrowIconWrapper>
              {item?.hasChildren && (
                <NodeIcon
                  onClick={handleExpand}
                  size={20}
                  rtl={rtl}
                  opened={item?.isExpanded}
                  dir={rtl ? 'left' : 'right'}
                />
              )}
            </ArrowIconWrapper>

            <DragIconWrapper
              onMouseDown={() => {}}
              {...provided.dragHandleProps}
            >
              <DragPaneIcon size={20} />
            </DragIconWrapper>

            <AddIconWrraper onClick={() => setAddItem(true)}>
              <AddIcon size={20} />
            </AddIconWrraper>

            <ItemIconContainer>
              <IoFileTrayFullOutline size={32} />
            </ItemIconContainer>

            <InlineEdit
              text={decodeBase64(Name)}
              styles={styles}
              onSetText={handleRenameTitle}
            />
          </TitleBlock>

          <CodeBlock>{decodeBase64(AdditionalID)}</CodeBlock>

          <CreationDateBlock>{CreationDate}</CreationDateBlock>

          <ThumbBlock></ThumbBlock>
        </Container>

        {addItem && (
          <TemplateItemSettingAddNew
            onClose={() => setAddItem(false)}
            onSave={handleCreateNode}
          />
        )}
      </TreeItemRow>
    </>
  );
};

const TreeItemRow = styled.div`
  min-height: 5rem;
  background-color: var(--rv-color-white);
  border-bottom: 1px solid var(--rv-color-distant);
`;
const Container = styled.div`
  ${FLEX_RCS};
  cursor: pointer;
  width: 100%;
  height: 5rem;
  gap: 0.5rem;
`;

const ArrowIconWrapper = styled.div`
  width: 20px;
`;

const DragIconWrapper = styled.div`
  width: 20px;
  cursor: grab;
`;

const AddIconWrraper = styled.button`
  border: none;
  color: var(--rv-color-distant);
  cursor: pointer;
  aspect-ratio: 1;
  width: 20px;
`;

const NodeIcon = styled(CaretIcon).attrs((props) => ({
  size: props.size,
  dir: props.dir,
}))`
  color: var(--rv-color-distant);
  cursor: pointer;
  transform: ${({ opened, rtl }) =>
    opened ? `rotate(${rtl ? '-90' : '90'}deg)` : 'rotate(0)'};
  transition: all 0.3s ease-out;
  ${({ rtl }) => (rtl ? 'margin-left: 0.5rem' : 'margin-right: 0.5rem')}
`;

const DragPaneIcon = styled(DragIcon).attrs((props) => ({
  size: props.size,
}))`
  color: var(--rv-color-distant);
`;

const TitleBlock = styled.div`
  flex: 60%;
  ${FLEX_RCS};
  gap: 1rem;
  ${({ rtl, depth }) =>
    rtl
      ? `padding-right: ${1.5 * depth}rem`
      : `padding-left: ${1.5 * depth}rem`};
`;

const CodeBlock = styled.div`
  flex: 10%;
`;

const CreationDateBlock = styled.div`
  flex: 10%;
`;

const ThumbBlock = styled.div`
  flex: 20%;
`;

const ItemIconContainer = styled.div`
  ${FLEX_CCC};
  width: 3rem;
  color: var(--rv-color-distant);
  gap: 0.8rem;
`;
export default TemplateItemSettingListTreeItem;
