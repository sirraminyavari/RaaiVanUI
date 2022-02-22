import * as Styled from './TemplateGeneralSettingSideFormStyles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import { useTemplateGeneralSettingSideForm } from './useTemplateGeneralSettingSideForm';

const TemplateGeneralSettingSideForm = () => {
  const {
    wiki,
    posts,
    handleWikiState,
    handlePostsState,
    communityPage,
    handleCommunityPage,
    comments,
    handleEnableComments,
    contributionState,
    handleEnableContribution,
    versioningState,
    handleVersioningState,
  } = useTemplateGeneralSettingSideForm();

  return (
    <Styled.Container>
      <Styled.Block>
        <Styled.Title>{'ساختار قالب'}</Styled.Title>
        <Styled.Section>
          <Styled.ItemTitle>{'دانش‌نامه قالب فعال باشد'}</Styled.ItemTitle>
          <ToggleButton value={wiki} onToggle={handleWikiState} />
        </Styled.Section>

        <Styled.Section>
          <Styled.ItemTitle>{'بخش دیدگاه‌ها'}</Styled.ItemTitle>
          <ToggleButton value={posts} onToggle={handlePostsState} />
        </Styled.Section>

        <Styled.Section>
          <Styled.ItemTitle>{' - اولویت دیدگاه در چیدمان'}</Styled.ItemTitle>
          <ToggleButton value={communityPage} onToggle={handleCommunityPage} />
        </Styled.Section>

        <Styled.Section>
          <Styled.ItemTitle>{'امکان ثبت نظر در آیتم'}</Styled.ItemTitle>
          <ToggleButton value={comments} onToggle={handleEnableComments} />
        </Styled.Section>
      </Styled.Block>

      <Styled.Block>
        <Styled.Title>{'امکانات ثبت'}</Styled.Title>
        <Styled.Section>
          <Styled.ItemTitle>{'ثبت گروهی آیتم'}</Styled.ItemTitle>
          <ToggleButton
            value={contributionState}
            onToggle={handleEnableContribution}
          />
        </Styled.Section>

        <Styled.Section>
          <Styled.ItemTitle>{'ثبت نسخه جدید برای آیتم'}</Styled.ItemTitle>
          <ToggleButton
            value={versioningState}
            onToggle={handleVersioningState}
          />
        </Styled.Section>
      </Styled.Block>
    </Styled.Container>
  );
};
export default TemplateGeneralSettingSideForm;
