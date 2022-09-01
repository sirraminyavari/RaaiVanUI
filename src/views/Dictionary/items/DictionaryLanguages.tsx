import Button from 'components/Buttons/Button';
import AnimatedTextArea from 'components/Inputs/AnimatedTextArea/AnimatedTextArea';
import {
  FLEX_CCC,
  FLEX_CES,
  FLEX_CSB,
  FLEX_CSE,
  FLEX_RCB,
  FLEX_RCE,
  FLEX_RSS,
} from 'constant/StyledCommonCss';
import styled from 'styled-components';
import { MdGTranslate } from 'react-icons/md';
import {
  IoChevronDownCircleOutline,
  IoChevronUpCircleOutline,
} from 'react-icons/io5';
import { useDictionaryContext } from '../DictionaryProvider';

const Languages = () => {
  const { selected } = useDictionaryContext();

  return (
    <Container>
      <div style={{ width: '100%' }}>
        <LanguageBlock>
          <LanguageTitleBlock>
            <LanguageTitle>English</LanguageTitle>
            <IconWrapper>
              <TarnslateIcon size={24} />
            </IconWrapper>
          </LanguageTitleBlock>
          <InputWrpper>
            <AnimatedTextArea
              value={selected?.title}
              autoresize={false}
              rows={6}
            />
          </InputWrpper>
        </LanguageBlock>

        <LanguageBlock>
          <LanguageTitleBlock>
            <LanguageTitle>Persian</LanguageTitle>
            <TarnslateIcon size={24} />
          </LanguageTitleBlock>
          <InputWrpper>
            <AnimatedTextArea autoresize={false} rows={6} placeholder="label" />
          </InputWrpper>
        </LanguageBlock>
      </div>
      <ActionBar>
        <Gap />
        <ButtonsContainer>
          <PublishBtn>Publish</PublishBtn>

          <NavButton>
            <IoChevronDownCircleOutline size={24} />
          </NavButton>
          <NavButton>
            <IoChevronUpCircleOutline size={24} />
          </NavButton>
        </ButtonsContainer>
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
  height: 12rem;
`;

const ActionBar = styled.div`
  ${FLEX_RCE};
  width: 100%;
`;

const Gap = styled.div`
  width: 10rem;
`;

const LanguageTitleBlock = styled.div`
  ${FLEX_CES};
  padding: 1rem;
  width: 10rem;
  gap: 0.5rem;
`;

const LanguageTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const InputWrpper = styled.div`
  width: 100%;
`;

const ButtonsContainer = styled.div`
  ${FLEX_RSS};
  width: 100%;
  flex: 1;
  gap: 1rem;
`;

const PublishBtn = styled(Button).attrs({
  type: 'primary',
})`
  width: 100%;
  height: 3rem;
  flex: 1;
`;

const IconWrapper = styled.div`
  ${FLEX_RCE};
`;

const TarnslateIcon = styled(MdGTranslate)`
  color: var(--rv-color);
`;

const NavButton = styled.button`
  ${FLEX_CCC};
  outline: none;
  border: non;
  background-color: transparent;
  height: 3rem;
  width: 3rem;
  aspect-ratio: 1;
  border-radius: 100%;
  cursor: pointer;
  color: var(--rv-color);

  &:hover {
    border: 1px solid var(--rv-color-distant);
    background-color: var(--rv-color-freezed);
  }
`;
export default Languages;
