import { useState } from 'react';
import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY, CV_GRAY_DARK } from 'constant/CssVariables';
import { FLEX_CSA } from 'constant/StyledCommonCss';

const TemplateTitleForm = ({ name }) => {
  const [title, setTitle] = useState(name);
  const [subtitle, setSubtitle] = useState('');
  return (
    <Container>
      <TitleInput value={title} onChange={(e) => setTitle(e?.target?.value)} />

      <SubtitleInput placeholder={'راهنمای تکمیل قالب'} value={subtitle} />
    </Container>
  );
};
const Container = styled.div`
  ${FLEX_CSA};
  gap: 2.1rem;
  width: 100%;
`;

const TitleInput = styled.input`
  height: 2.75rem;
  width: 18.75rem;
  outline: none;
  border: none;
  border-bottom: 1px solid ${CV_DISTANT};
  color: ${CV_GRAY_DARK};
  background-color: transparent;
  font-size: 1.75rem;
`;

const SubtitleInput = styled.input`
  height: 1.6rem;
  max-width: 48rem;
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid ${CV_DISTANT};
  background-color: transparent;
  font-size: 0.85rem;
  color: ${CV_GRAY};
`;

export default TemplateTitleForm;
