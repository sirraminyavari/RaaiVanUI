import styled from 'styled-components';
import useWindowContext from 'hooks/useWindowContext';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_DISTANT } from 'constant/CssVariables';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import DragIcon from 'components/Icons/DragIcon/Drag';
import TemplateInlineEdit from './TemplatesInlineEdit';
import TemplateCreateNew from './TemplateCreateNew';
import TemplateDeleteButton from './TemplateDeleteButton';
import { useContext } from 'react';
import { TemplateListContext } from '../TemplatesSettings';

const SHTemplateItem = ({
  item,
  provided,
  onExpand,
  onCollapse,
  depth,
  onRenameSubmit,
  ...rest
}) => {
  const { RV_RTL } = useWindowContext();
  const { handleDeleteNode, handleAddNodeType } = useContext(
    TemplateListContext
  );

  const toggleItem = () => {
    if (item.isExpanded) {
      onCollapse(item?.id);
    } else {
      onExpand(item?.id);
    }
  };

  const handleRename = (name) => {
    if (onRenameSubmit) onRenameSubmit(name, item?.id);
  };

  const handleDelete = () => {
    if (handleDeleteNode) handleDeleteNode(item?.id);
  };

  return (
    <TreeItemRow
      style={{ direction: 'rtl' }}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}>
      <TreeItemContainer rtl={RV_RTL} depth={depth}>
        <ArrowIconWrapper>
          {item?.hasChildren && (
            <NodeIcon
              onClick={() => toggleItem()}
              size={20}
              rtl={RV_RTL}
              opened={item?.isExpanded}
              dir={RV_RTL ? 'left' : 'right'}
            />
          )}
        </ArrowIconWrapper>

        <DragIconWrapper onMouseDown={() => onCollapse(item?.id)}>
          <DragPaneIcon size={20} />
        </DragIconWrapper>

        <TemplateCreateNew
          parent={item?.id}
          onSubmit={(name, parent) => handleAddNodeType(name, parent)}
        />

        {item?.data?.IconURL && <ItemIcon src={item?.data?.IconURL} />}

        <TemplateInlineEdit
          value={item?.data?.title}
          onConfirm={(name) => handleRename(name)}
        />

        <Spacer />

        <TemplateDeleteButton onDeleteConfirm={() => handleDelete()} />
      </TreeItemContainer>
    </TreeItemRow>
  );
};
const TreeItemRow = styled.div`
  height: 5rem;
  ${FLEX_RCS};
  border-bottom: 1px solid ${CV_DISTANT};
`;
const TreeItemContainer = styled.div`
  ${FLEX_RCS};
  ${({ rtl, depth }) =>
    rtl ? `margin-right: ${3 * depth}rem` : `margin-left: ${3 * depth}rem`};
  cursor: default;
  width: 100%;
  height: 5rem;
  gap: 1rem;
`;
const ArrowIconWrapper = styled.div`
  width: 20px;
`;
const DragIconWrapper = styled.div`
  width: 20px;
  cursor: grab;
`;
const NodeIcon = styled(CaretIcon).attrs((props) => ({
  size: props.size,
  dir: props.dir,
}))`
  color: ${CV_DISTANT};
  cursor: pointer;
  transform: ${({ opened, rtl }) =>
    opened ? `rotate(${rtl ? '-90' : '90'}deg)` : 'rotate(0)'};
  transition: all 0.3s ease-out;
  margin-${({ rtl }) => (rtl ? 'left' : 'right')}: 0.5rem;
`;
const DragPaneIcon = styled(DragIcon).attrs((props) => ({
  size: props.size,
}))`
  color: ${CV_DISTANT};
`;
const ItemIcon = styled.img`
  width: 3rem;
  height: 3rem;
`;
const Spacer = styled.div`
  flex: 1;
`;
export default SHTemplateItem;
