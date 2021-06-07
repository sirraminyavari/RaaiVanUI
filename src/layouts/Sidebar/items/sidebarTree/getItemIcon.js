import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindow from 'hooks/useWindowContext';

const ItemIcon = (item, onExpand, onCollapse) => {
  const { RV_RevFloat } = useWindow();

  //! Expand sidebar item on click.
  const handleOnExpand = () => {
    onExpand(item.id);
  };

  //! Collapse sidebar item on click.
  const handleOnCollapse = () => {
    onCollapse(item.id);
  };

  if ((item.children && item.children.length > 0) || item.isCategory) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={handleOnCollapse} dir="down" />
    ) : (
      <CaretIcon size={20} onClick={handleOnExpand} dir={RV_RevFloat} />
    );
  }
  return null;
};

export default ItemIcon;
