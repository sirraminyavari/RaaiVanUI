import * as Styled from './TemplatesGallery.styles';
import Badge from 'components/Badge/Badge';

const TemplateCard = ({ template }) => {
  return (
    <Styled.TemplateCardContainer>
      <Badge showText="مدیریت منابع انسانی" className="template-card-badge" />
      <div>
        <img width={45} src="../../images/Preview.png" alt="template-logo" />
      </div>
      <Styled.TemplateCardTitle>شرح شغلی</Styled.TemplateCardTitle>
      <Styled.TemplateCardExcerpt>
        به دقیق‌ترین شکل ممکن سرمایه ارتباطی تیم‌تان را .حفظ کنید و آن را ارتقاء
        دهید
      </Styled.TemplateCardExcerpt>
    </Styled.TemplateCardContainer>
  );
};

export default TemplateCard;
