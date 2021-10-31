import * as Styled from './TeamSettingsStyle';
import useTeamSettings from './useTeamSettings';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Heading from '../../components/Heading/Heading';
import TeamThumbEdit from './items/TeamThumbEdit';
import {
  Indicator,
  ThumbnailOption,
  ThumbnailControl,
} from './items/CustomSelect';
import AnimatedTextArea from './items/AnimatedTextArea';
import ImageCropperEditor from '../../components/ImageCropper/ImageCropperEditor';
import Button from '../../components/Buttons/Button';
import { SettingActionBar } from './TeamSettingsStyle';

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
            <Styled.Select
              classNamePrefix="select"
              placeholder=""
              options={teamOwnerOptions}
              components={{
                DropdownIndicator: Indicator,
                Option: ThumbnailOption,
                SingleValue: ThumbnailControl,
              }}
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>حوزه فعالیت تیم</Styled.SelectTitle>
            <Styled.Select
              classNamePrefix="select"
              placeholder=""
              options={fieldOfExpertiseOption}
              components={{ DropdownIndicator: Indicator }}
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>زبان</Styled.SelectTitle>
            <Styled.Select
              classNamePrefix="select"
              isRtl={rtl}
              placeholder=""
              options={languageOption}
              components={{ DropdownIndicator: Indicator }}
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <Styled.SelectTitle>تقویم کلیک مایند</Styled.SelectTitle>
            <Styled.Select
              classNamePrefix="select"
              placeholder=""
              options={calOption}
              components={{ DropdownIndicator: Indicator }}
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
