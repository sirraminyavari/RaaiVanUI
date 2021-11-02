import * as Styled from './TeamSettingsStyle';
import useTeamSettings from './useTeamSettings';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Heading from '../../components/Heading/Heading';
import AnimatedTextArea from './items/AnimatedTextArea';
import Button from '../../components/Buttons/Button';
import CustomSelect from '../../components/Inputs/CustomSelect/CustomSelect';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import CustomSelectIndicator from '../../components/Inputs/CustomSelect/items/CustomSelectIndicator';

const TeamSettings = (props) => {
  const {
    rtl,
    teamTitle,
    breadCrumbItems,
    fieldOfExpertiseOption,
    teamOwnerOptions,
    languageOption,
    calOption,
    teamSizeOption,
    appInfo,
  } = useTeamSettings(props);

  return (
    <Styled.TeamSettingsCardWrapper>
      <Styled.TeamSettingsContainer rtl={rtl}>
        <Breadcrumb items={breadCrumbItems} />

        <Heading type={'h1'}>{'تنظیمات تیم'}</Heading>

        <Styled.FormWrapper>
          <Styled.TeamThumbnailContainer>
            <ImageCropper
              isEditable={true}
              uploadType="ApplicationIcon"
              uploadId={appInfo?.ApplicationID}
              image={appInfo?.IconURL}
            />
          </Styled.TeamThumbnailContainer>

          <Styled.TeamTitle>{teamTitle}</Styled.TeamTitle>

          <Styled.TeamSubtitle>شعار / تک لاین تیم</Styled.TeamSubtitle>

          <Styled.TeamSubtitle>وبسایت</Styled.TeamSubtitle>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>حوزه فعالیت تیم</Styled.SelectTitle>
            <CustomSelect
              placeholder=""
              options={fieldOfExpertiseOption}
              components={{
                DropdownIndicator: CustomSelectIndicator,
              }}
              classNamePrefix="select"
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>اندازه تیم</Styled.SelectTitle>
            <CustomSelect
              placeholder=""
              options={teamSizeOption}
              components={{
                DropdownIndicator: CustomSelectIndicator,
              }}
              classNamePrefix="select"
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>زبان</Styled.SelectTitle>
            <CustomSelect
              isRtl={rtl}
              placeholder=""
              options={languageOption}
              components={{
                DropdownIndicator: CustomSelectIndicator,
              }}
              classNamePrefix="select"
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>تقویم کلیک مایند</Styled.SelectTitle>
            <CustomSelect
              placeholder=""
              options={calOption}
              components={{
                DropdownIndicator: CustomSelectIndicator,
              }}
              classNamePrefix="select"
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <AnimatedTextArea
              autoresize={true}
              label={'درباره تیم'}
              rtl={rtl}
            />
          </Styled.FieldWrapper>

          <Styled.SettingActionBar>
            <Button type="primary">ذخیره</Button>
          </Styled.SettingActionBar>
        </Styled.FormWrapper>
      </Styled.TeamSettingsContainer>
    </Styled.TeamSettingsCardWrapper>
  );
};

export default TeamSettings;
