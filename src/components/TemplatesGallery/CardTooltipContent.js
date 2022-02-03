import { memo } from 'react';
import * as Styled from './TemplatesGallery.styles';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';

const CardTooltipContent = ({ extraTags }) => {
  return (
    <Styled.CardTooltipContainer>
      <ScrollBarProvider>
        {extraTags?.map((tag, index) => {
          return (
            <Styled.ExtraTagWrapper key={index}>
              {decodeBase64(tag?.Name)}
            </Styled.ExtraTagWrapper>
          );
        })}
      </ScrollBarProvider>
    </Styled.CardTooltipContainer>
  );
};

export default memo(CardTooltipContent);
