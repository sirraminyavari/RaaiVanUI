import { useContext } from 'react';
import * as Styled from './TemplatesGallery.styles';
import Badge from 'components/Badge/Badge';
import { decodeBase64 } from 'helpers/helpers';
import {
  TemplatesGalleryContext,
  DESCRIPTIONS_CONTENT,
} from './TemplatesGallery';

const TemplateCard = ({ template, mode, containerClass }) => {
  const { setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );

  console.log(template);

  const handleClickCard = () => {
    setContent({ name: DESCRIPTIONS_CONTENT, data: { template } });
    setCurrentTemplate(template);
  };

  const hasTags = template?.Tags?.length;

  return (
    <Styled.TemplateCardContainer className={containerClass} mode={mode}>
      {!!hasTags && (
        <Badge
          showText={decodeBase64(template?.Tags?.[0]?.Name)}
          className="template-card-badge"
        />
      )}
      <div>
        <img width={45} src={template?.IconURL} alt="template-logo" />
      </div>
      <Styled.TemplateCardTitle onClick={handleClickCard}>
        {decodeBase64(template?.TypeName)}
      </Styled.TemplateCardTitle>
      <Styled.TemplateCardExcerpt>
        به دقیق‌ترین شکل ممکن سرمایه ارتباطی تیم‌تان را .حفظ کنید و آن را ارتقاء
        دهید
      </Styled.TemplateCardExcerpt>
    </Styled.TemplateCardContainer>
  );
};

export default TemplateCard;
