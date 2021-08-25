import { useContext } from 'react';
import getIcon from 'utils/treeUtils/getItemIcon';
import * as Styled from './TemplatesGallery.styles';
import {
  TemplatesGalleryContext,
  CATEGORY_CONTENT,
  DESCRIPTIONS_CONTENT,
} from './TemplatesGallery';

const INDENT_PER_LEVEL = 20;

const TemplateListItem = ({ itemProps }) => {
  const { item, onExpand, onCollapse, provided, depth } = itemProps;
  const {
    setContent,
    setCurrentCategory,
    setCurrentTemplate,
    currentTemplate,
    currentCategory,
  } = useContext(TemplatesGalleryContext);

  const handleClickItem = () => {
    //! Change content.
    if (item?.isCategory) {
      setContent({ name: CATEGORY_CONTENT, data: { item } });
      setCurrentCategory(item);
      setCurrentTemplate(null);
    } else {
      setContent({ name: DESCRIPTIONS_CONTENT, data: { item } });
      setCurrentTemplate(item);
    }

    //! Handle item open and close.
    if (item?.isExpanded) {
      onCollapse(item?.id);
    } else {
      onExpand(item?.id);
    }
  };

  const itemIsSelected =
    currentTemplate?.id === item?.id ||
    (currentCategory?.id === item?.id && !currentTemplate);

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
      <Styled.TemplateItemTitle isSelected={itemIsSelected}>
        {item?.data?.title}
      </Styled.TemplateItemTitle>
    </Styled.TemplateItemWrapper>
  );
};

export default TemplateListItem;
