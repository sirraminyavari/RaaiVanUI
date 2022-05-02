import styled from 'styled-components';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { GoSettings } from 'react-icons/all';
import { CV_DISTANT } from 'constant/CssVariables';

const SeparatorTypeSideBoxSetting = ({}) => {
  return (
    <Container>
      <GoSettings size={32} />
      <div>{'تنظیماتی وجود ندارد'}</div>
    </Container>
  );
};
const Container = styled.div`
  ${FLEX_CCC};
  width: 100%;
  height: 12rem;
  gap: 1rem;
  color: ${CV_DISTANT};
`;

export default SeparatorTypeSideBoxSetting;
