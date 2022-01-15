import styled from 'styled-components';
import useWindowContext from 'hooks/useWindowContext';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_DISTANT } from 'constant/CssVariables';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import DragIcon from 'components/Icons/DragIcon/Drag';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import TemplateInlineEdit from './TemplatesInlineEdit';

const SHTemplateItem = ({
  item,
  provided,
  onExpand,
  onCollapse,
  depth,
  ...rest
}) => {
  const { RV_RTL } = useWindowContext();
  const toggleItem = () => {
    if (item.isExpanded) {
      onCollapse(item?.id);
    } else {
      onExpand(item?.id);
    }
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
        <DragIconWrapper>
          <DragPaneIcon size={20} />
        </DragIconWrapper>
        <AddButton>
          <AddIcon size={20} />
        </AddButton>
        <ItemIcon src={item?.data?.IconURL} />
        <TemplateInlineEdit value={item?.data?.title} />
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
    rtl ? `margin-right: ${2 * depth}rem` : `margin-left: ${2 * depth}rem`};
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
const AddButton = styled.button`
  width: 1.5rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  color: ${CV_DISTANT};
`;
const ItemIcon = styled.img`
  width: 3rem;
  height: 3rem;
`;
export default SHTemplateItem;
