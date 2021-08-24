import getIcon from 'utils/treeUtils/getItemIcon';
import * as Styled from './TemplatesGallery.styles';
const INDENT_PER_LEVEL = 20;

const TemplateListItem = ({ itemProps }) => {
  const { item, onExpand, onCollapse, provided, depth } = itemProps;

  const handleClickItem = () => {
    if (item?.isExpanded) {
      onCollapse(item?.id);
    } else {
      onExpand(item?.id);
    }
  };

  return (
    <Styled.TemplateItemWrapper
      indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
      onClick={handleClickItem}
      ref={provided.innerRef}>
      {item?.isCategory ? (
        <Styled.TemplateIconWrapper isExpanded={item?.isExpanded}>
          {getIcon(item)}
        </Styled.TemplateIconWrapper>
      ) : (
        <img width={20} src="../../images/Preview.png" alt="template-logo" />
      )}
      <Styled.TemplateItemTitle isSelected={false}>
        {item?.data?.title}
      </Styled.TemplateItemTitle>
    </Styled.TemplateItemWrapper>
  );
};

export default TemplateListItem;
