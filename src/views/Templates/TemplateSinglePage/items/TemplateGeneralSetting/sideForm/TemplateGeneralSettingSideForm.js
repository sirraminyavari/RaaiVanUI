import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import { useTemplateGeneralSettingSideForm } from './useTemplateGeneralSettingSideForm';

const TemplateGeneralSettingSideForm = () => {
  const { wiki, posts, handleWikiState, handlePostsState } =
    useTemplateGeneralSettingSideForm();

  return (
    <Container>
      <Block>
        <Title>{'ساختار قالب'}</Title>
        <Section>
          <ItemTitle>{'دانش‌نامه قالب فعال باشد'}</ItemTitle>
          <ToggleButton value={wiki} onToggle={handleWikiState} />
        </Section>

        <Section>
          <ItemTitle>{'بخش دیدگاه‌ها'}</ItemTitle>
          <ToggleButton value={posts} onToggle={handlePostsState} />
        </Section>

        <Section>
          <ItemTitle>{' - اولویت دیدگاه در چیدمان'}</ItemTitle>
          <ToggleButton value={true} />
        </Section>

        <Section>
          <ItemTitle>{'امکان ثبت نظر در آیتم'}</ItemTitle>
          <ToggleButton value={true} />
        </Section>
      </Block>

      <Block>
        <Title>{'امکانات ثبت'}</Title>
        <Section>
          <ItemTitle>{'ثبت گروهی آیتم'}</ItemTitle>
          <ToggleButton value={true} />
        </Section>

        <Section>
          <ItemTitle>{'ثبت نسخه جدید برای آیتم'}</ItemTitle>
          <ToggleButton value={true} />
        </Section>
      </Block>
    </Container>
  );
};
export const Container = styled.div`
  padding: 0 1.5rem;
`;

export const Block = styled.div`
  margin: 2.2rem 0 0 0;
`;

export const Title = styled.div`
  font-size: 0.85rem;
  color: ${CV_DISTANT};
  margin-bottom: 1.5rem;
`;

export const Section = styled.div`
  ${FLEX_RCB};
  margin-bottom: 1.5rem;
`;

export const ItemTitle = styled.div`
  font-size: 1rem;
  color: ${CV_GRAY_DARK};
`;

export default TemplateGeneralSettingSideForm;
