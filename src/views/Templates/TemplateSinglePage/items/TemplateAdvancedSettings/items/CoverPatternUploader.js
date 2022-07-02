import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_LIGHT,
  CV_WHITE,
} from '../../../../../../constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_RCC,
  FLEX_RSS,
} from '../../../../../../constant/StyledCommonCss';
import { BsFileEarmarkArrowUp } from 'react-icons/all';

const CoverPatternUploader = ({ children }) => {
  return (
    <Container>
      <UploadBox>
        <div>
          <Icon size={36} />
        </div>
        <Message>{'برای آپلود فایل خود را درون کادر نقطه‌چین بکشید'}</Message>
      </UploadBox>

      <UploadedItemSliderContainer>
        <FlippedCorner></FlippedCorner>
        <Placeholder>
          {'هنوز هیچ الگویی برای فایل PDF بارگذاری نشده است'}
        </Placeholder>
      </UploadedItemSliderContainer>
    </Container>
  );
};
const Container = styled.div`
  ${FLEX_RSS};
  gap: 1rem;
`;

const UploadBox = styled.div`
  ${FLEX_CCC};
  border: 0.125rem dashed ${CV_DISTANT};
  flex: 1;
  max-width: 38rem;
  width: 100%;
  min-height: 14.5rem;
  border-radius: 0.5rem;
  gap: 1rem;
`;
const Message = styled.div`
  font-size: 0.875rem;
  text-align: center;
  color: ${CV_DISTANT};
  font-weight: 300;
`;

const Icon = styled(BsFileEarmarkArrowUp)`
  color: ${CV_DISTANT};
`;

const UploadedItemSliderContainer = styled.div`
  ${FLEX_CCC};
  height: 14.5rem;
  width: 11rem;
  border: 0.125rem solid #eef1f5;
  background-color: ${CV_WHITE};
  border-radius: 1.25rem 2.6rem 1.25rem 1.25rem;
  position: relative;
`;

const FlippedCorner = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  height: 2rem;
  width: 2rem;
  background-color: ${CV_WHITE};
  border-radius: 0.3rem;
  border: 0.125rem solid #eef1f5;
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
`;
const Placeholder = styled.div`
  width: 6rem;
  font-size: 0.8rem;
  color: ${CV_DISTANT};
  font-weight: 300;
  text-align: center;
  line-height: 1.8rem;
`;

export default CoverPatternUploader;
