import { useContext } from 'react';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { WindowContext } from 'context/WindowProvider';

const ItemIcon = (item, onExpand, onCollapse) => {
  const { RV_RevFloat } = useContext(WindowContext);

  if ((item.children && item.children.length > 0) || item.isCategory) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={() => onCollapse(item.id)} dir="down" />
    ) : (
      <CaretIcon
        size={20}
        onClick={() => onExpand(item.id)}
        dir={RV_RevFloat}
      />
    );
  }
  return null;
};

export default ItemIcon;
