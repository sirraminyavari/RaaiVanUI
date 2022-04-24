import * as Styled from './TemplatesGallery.styles';
import EmptyStates from 'components/EmptyState/EmptyState';
import useWindow from 'hooks/useWindowContext';

const EmptyTemplateCard = () => {
  const { RVDic } = useWindow();

  return (
    <Styled.TemplateCardContainer style={{ border: 'none' }}>
      <EmptyStates />
      <div
        style={{
          textAlign: 'center',
          fontSize: '1rem',
        }}
      >
        {RVDic.MSG.NoSuggestionsFound}
      </div>
    </Styled.TemplateCardContainer>
  );
};

export default EmptyTemplateCard;
