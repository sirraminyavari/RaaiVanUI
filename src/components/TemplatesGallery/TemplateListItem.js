import { useContext, useState } from 'react';
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
    // currentTemplate,
    // currentCategory,
  } = useContext(TemplatesGalleryContext);
  const [isSelected, setIsSelected] = useState(false);

  const handleClickIcon = () => {
    console.log(item);

    //! Handle item open and close.
    if (item?.isExpanded) {
      onCollapse(item?.id);
      item?.isCategory && setIsSelected(false);
    } else {
      onExpand(item?.id);
      item?.isCategory && setIsSelected(true);
    }
  };

  const handleClickTitle = () => {
    //! Change content.
    if (item?.isCategory) {
      setContent({ name: CATEGORY_CONTENT, data: item?.data?.rawData });
      setCurrentCategory(item?.data?.rawData);
      setCurrentTemplate(null);
    } else {
      setContent({ name: DESCRIPTIONS_CONTENT, data: item?.data });
      setCurrentTemplate(item?.data?.rawData);
    }

    handleClickIcon();
  };

  return (
    <Styled.TemplateItemWrapper
      indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
      ref={provided.innerRef}
    >
      {item?.isCategory ? (
        <Styled.TemplateIconWrapper
          onClick={handleClickIcon}
          isExpanded={item?.isExpanded}
        >
          {getIcon(item)}
        </Styled.TemplateIconWrapper>
      ) : (
        <img
          width={20}
          src={item?.data?.rawData?.IconURL}
          alt="template-logo"
        />
      )}
      <Styled.TemplateItemTitle
        onClick={handleClickTitle}
        isSelected={isSelected}
      >
        {item?.data?.title}
      </Styled.TemplateItemTitle>
    </Styled.TemplateItemWrapper>
  );
};

export default TemplateListItem;
