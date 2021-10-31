import * as Styled from './TeamSettingsStyle';
import useTeamSettings from './useTeamSettings';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Heading from '../../components/Heading/Heading';
import TeamThumbEdit from './items/TeamThumbEdit';
import AnimatedTextArea from './items/AnimatedTextArea';
import Button from '../../components/Buttons/Button';
import CustomSelect from '../../components/Inputs/CustomSelect/CustomSelect';
import CustomThumbSelectControl from '../../components/Inputs/CustomSelect/items/CustomThumbSelectControl';
import CustomThumbSelectOption from '../../components/Inputs/CustomSelect/items/CustomThumbSelectOption';

const TeamSettings = (props) => {
  const {
    rtl,
    breadCrumbItems,
    imgUrl,
    fieldOfExpertiseOption,
    teamOwnerOptions,
    languageOption,
    calOption,
    uploadThumbnail,
  } = useTeamSettings(props);

  return (
    <Styled.TeamSettingsCardWrapper>
      <Styled.TeamSettingsContainer rtl={rtl}>
        <Breadcrumb items={breadCrumbItems} />

        <Heading type={'h1'}>{'تنظیمات تیم'}</Heading>

        <Styled.FormWrapper>
          <TeamThumbEdit upload={uploadThumbnail}>
            <Styled.TeamThumbnail src={imgUrl}></Styled.TeamThumbnail>
          </TeamThumbEdit>

          <Styled.TeamTitle> نام تیم</Styled.TeamTitle>

          <Styled.TeamSubtitle>شعار / تک لاین تیم</Styled.TeamSubtitle>

          <Styled.TeamSubtitle>وبسایت</Styled.TeamSubtitle>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>مالک تیم</Styled.SelectTitle>
            <CustomSelect
              placeholder=""
              options={teamOwnerOptions}
              components={{
                Option: CustomThumbSelectOption,
                SingleValue: CustomThumbSelectControl,
              }}
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>حوزه فعالیت تیم</Styled.SelectTitle>
            <CustomSelect placeholder="" options={fieldOfExpertiseOption} />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>زبان</Styled.SelectTitle>
            <CustomSelect
              classNamePrefix="select"
              isRtl={rtl}
              placeholder=""
              options={languageOption}
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>تقویم کلیک مایند</Styled.SelectTitle>
            <CustomSelect
              classNamePrefix="select"
              placeholder=""
              options={calOption}
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
