/**
 * Renders menu item that may or may not have sub-menus(branches).
 */
import { memo } from 'react';
import * as Styled from '../../../Sidebar.styles';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { Link } from 'react-router-dom';

const PADDING_PER_LEVEL = 27;

const getIcon = (item, onExpand, onCollapse) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={() => onCollapse(item.id)} dir="down" />
    ) : (
      <CaretIcon size={20} onClick={() => onExpand(item.id)} dir="left" />
    );
  }
  return null;
};

/**
 * @typedef ItemType
 * @property {Object} item -The item.
 * @property {function} onExpand -The callback function that calls on item expand.
 * @property {function} onCollapse -The callback function that calls on item collapse.
 * @property {*} provided -Provided by dnd.
 * @property {*} snapshot -Provided by dnd.
 * @property {number} depth -Depth of item on tree.
 */

/**
 * @typedef PropType
 * @property {ItemType} itemProps - The item props.
 */

/**
 *  @description Renders a menu item for sidebar.
 * @component
 * @param {PropType} props
 */
const ReadableBranch = (props) => {
  const { itemProps } = props;

  const { item, onExpand, onCollapse, provided, depth, snapshot } = itemProps;

  const handleOnClick = () => {};

  return (
    <>
      <Styled.MenuContainer
        margin={depth === 0 ? 0 : `${PADDING_PER_LEVEL * depth}`}
        isExpanded={item.isExpanded}
        ref={provided.innerRef}
        {...provided.draggableProps}>
        <Styled.MenuTitleWrapper>
          {item.hasChildren ? (
            <Styled.CaretIconWrapper>
              {getIcon(item, onExpand, onCollapse)}
            </Styled.CaretIconWrapper>
          ) : (
            <Styled.MenuItemImage src={item.data.iconURL} alt="menu-icon" />
          )}
          <Styled.MenuTitle
            onClick={handleOnClick}
            as={Link}
            to={`/classes/${item.id}`}>
            {item.data.title}
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default memo(ReadableBranch);
