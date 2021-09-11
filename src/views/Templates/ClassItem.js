import getIcon from 'utils/treeUtils/getItemIcon';
import * as Styled from './Templates-view.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import { CV_DISTANT } from 'constant/CssVariables';

const ClassItem = ({ itemProps }) => {
  const { item, onExpand, onCollapse, provided } = itemProps;

  const handleClickItem = () => {
    //! Handle item open and close.
    if (item?.isExpanded) {
      onCollapse(item?.id);
    } else {
      onExpand(item?.id);
    }
  };

  const handleDeleteClass = (e) => {
    e.stopPropagation();
    console.log('delete class');
  };

  return (
    <Styled.ClassItemWrapper ref={provided.innerRef} onClick={handleClickItem}>
      {item?.isCategory && getIcon(item)}
      <Styled.ClassItemTitle isOther={item?.isOther}>
        {item.data.title}
      </Styled.ClassItemTitle>
      {!item?.isOther && (
        <div className="trash-wrapper" onClick={handleDeleteClass}>
          <TrashIcon color={CV_DISTANT} />
        </div>
      )}
    </Styled.ClassItemWrapper>
  );
};

export default ClassItem;
