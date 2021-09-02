import { useContext } from 'react';
import * as Styled from './TemplatesGallery.styles';
import Badge from 'components/Badge/Badge';
import { decodeBase64 } from 'helpers/helpers';
import {
  TemplatesGalleryContext,
  DESCRIPTIONS_CONTENT,
} from './TemplatesGallery';

const TemplateCard = ({ template, mode }) => {
  const { setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );

  // console.log(template);

  const handleClickCard = () => {
    setContent({ name: DESCRIPTIONS_CONTENT, data: { template } });
    setCurrentTemplate(template);
  };

  return (
    <Styled.TemplateCardContainer mode={mode}>
      <Badge showText="مدیریت منابع انسانی" className="template-card-badge" />
      <div>
        <img width={45} src="../../images/Preview.png" alt="template-logo" />
      </div>
      <Styled.TemplateCardTitle onClick={handleClickCard}>
        {decodeBase64(template?.Name)}
      </Styled.TemplateCardTitle>
      <Styled.TemplateCardExcerpt>
        به دقیق‌ترین شکل ممکن سرمایه ارتباطی تیم‌تان را .حفظ کنید و آن را ارتقاء
        دهید
      </Styled.TemplateCardExcerpt>
    </Styled.TemplateCardContainer>
  );
};

export default TemplateCard;
