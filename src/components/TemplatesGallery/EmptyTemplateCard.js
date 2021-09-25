import * as Styled from './TemplatesGallery.styles';
import EmptyStates from 'components/EmptyState/EmptyState';

const EmptyTemplateCard = () => {
  return (
    <Styled.TemplateCardContainer style={{ border: 'none' }}>
      <EmptyStates />
      <div
        style={{
          textAlign: 'center',
          fontSize: '1rem',
        }}>
        هیچ پیشنهادی یافت نشد!
      </div>
    </Styled.TemplateCardContainer>
  );
};

export default EmptyTemplateCard;
