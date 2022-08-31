import Button from 'components/Buttons/Button';
import AnimatedTextArea from 'components/Inputs/AnimatedTextArea/AnimatedTextArea';
import {
  FLEX_CSB,
  FLEX_RCB,
  FLEX_RCE,
  FLEX_RSS,
} from 'constant/StyledCommonCss';
import styled from 'styled-components';

const Languages = () => {
  return (
    <Container>
      <div style={{ width: '100%' }}>
        <LanguageBlock>
          <LanguageTitle>English</LanguageTitle>
          <InputWrpper>
            <AnimatedTextArea autoresize={false} rows={4} />
          </InputWrpper>
        </LanguageBlock>

        <LanguageBlock>
          <LanguageTitle>English</LanguageTitle>
          <InputWrpper>
            <AnimatedTextArea autoresize={false} rows={4} placeholder="label" />
          </InputWrpper>
        </LanguageBlock>
      </div>
      <ActionBar>
        <PublishBtn>Publish</PublishBtn>
      </ActionBar>
    </Container>
  );
};
const Container = styled.div`
  ${FLEX_CSB};
  height: calc(100vh - 7rem);
  width: 100%;
`;

const LanguageBlock = styled.div`
  ${FLEX_RSS};
  gap: 1rem;
  width: 100%;
  height: 10rem;
`;

const ActionBar = styled.div`
  ${FLEX_RCE};
  width: calc(100% - 10rem);
`;

const LanguageTitle = styled.div`
  width: 8rem;
`;

const InputWrpper = styled.div`
  width: 100%;
`;

const PublishBtn = styled(Button).attrs({
  type: 'primary',
})`
  width: 100%;
  height: 3rem;
`;

export default Languages;
