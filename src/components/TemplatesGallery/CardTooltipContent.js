import { memo } from 'react';
import * as Styled from './TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';

const CardTooltipContent = ({ extraTags }) => {
  return (
    <Styled.CardTooltipContainer>
      <PerfectScrollbar className="extra-tags-scrollbar">
        {extraTags?.map((tag, index) => {
          return (
            <Styled.ExtraTagWrapper key={index}>
              {decodeBase64(tag?.Name)}
            </Styled.ExtraTagWrapper>
          );
        })}
      </PerfectScrollbar>
    </Styled.CardTooltipContainer>
  );
};

export default memo(CardTooltipContent);
