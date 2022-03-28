import styled from 'styled-components';
import { CV_DISTANT } from 'constant/CssVariables';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { BsFileEarmarkArrowUp } from 'react-icons/all';

const Uploader = () => {
  return (
    <>
      <Container>
        <div>
          <Icon size={36} />
        </div>
        <Message>{'برای آپلود فایل خود را درون کادر نقطه‌چین بکشید'}</Message>
      </Container>
    </>
  );
};
const Container = styled.div`
  ${FLEX_CCC};
  width: 100%;
  height: 10.9rem;
  border: 2px dashed ${CV_DISTANT};
  border-radius: 0.8rem;
  gap: 0.2rem;
  user-select: none;
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
export default Uploader;
