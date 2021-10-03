import { useContext } from 'react';
import TemplateCard from 'components/TemplatesGallery/TemplateCard';
import * as Styled from 'components/TemplatesGallery/TemplatesGallery.styles';
import {
  DESCRIPTIONS_CONTENT,
  TemplatesGalleryContext,
} from 'components/TemplatesGallery/TemplatesGallery';

const SubCategoryList = ({ items }) => {
  const { setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );

  const handleClickCard = (template) => {
    setContent({ name: DESCRIPTIONS_CONTENT, data: { template } });
    setCurrentTemplate(template);
  };

  return (
    <Styled.SubCategoryContainer>
      {items?.map((item) => {
        return (
          <TemplateCard
            clickable
            onClickCard={handleClickCard}
            mode="grid"
            template={item}
            key={item?.NodeTypeID}
            containerClass="template-category-card"
          />
        );
      })}
    </Styled.SubCategoryContainer>
  );
};

export default SubCategoryList;
