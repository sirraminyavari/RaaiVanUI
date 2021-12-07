import { useContext } from 'react';
import { TemplateSelectContext } from './TemplateSelect';
import * as Styled from './TemplateSelect.styles';
import getIcon from 'utils/treeUtils/getItemIcon';

const INDENT_PER_LEVEL = 20;

const TemplateListItem = ({ itemProps }) => {
  const { item, onExpand, onCollapse, provided, depth } = itemProps;
  const { currentNode, setCurrentNode } = useContext(TemplateSelectContext);

  const handleClickItem = () => {
    //! Handle item open and close.
    if (item?.isExpanded) {
      onCollapse(item?.id);
    } else {
      onExpand(item?.id);
    }

    if (!item?.hasChildren) {
      setCurrentNode(item?.data?.rawData);
    }
  };

  const isSelected = currentNode?.NodeTypeID === item?.id;

  return (
    <Styled.TemplateItemWrapper
      onClick={handleClickItem}
      indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
      ref={provided.innerRef}>
      {item?.hasChildren ? (
        <Styled.TemplateIconWrapper isExpanded={item?.isExpanded}>
          {getIcon(item)}
        </Styled.TemplateIconWrapper>
      ) : (
        <img
          width={26}
          src={item?.data?.rawData?.IconURL}
          alt="template-icon"
        />
      )}
      <Styled.TemplateItemTitle isSelected={isSelected}>
        {item?.data?.title}
      </Styled.TemplateItemTitle>
    </Styled.TemplateItemWrapper>
  );
};

export default TemplateListItem;
