import * as Styled from './TeamSettingsStyle';
import useTeamSettings from './useTeamSettings';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Heading from '../../components/Heading/Heading';
import ThumbMaker from './items/ThumbMaker';
import {
  Indicator,
  ThumbnailOption,
  ThumbnailControl,
} from './items/CustomSelect';

const TeamSettings = (props) => {
  const {
    rtl,
    breadCrumbItems,
    imgUrl,
    fieldOfExpertiseOption,
    teamOwnerOptions,
    uploadThumbnail,
  } = useTeamSettings(props);

  return (
    <Styled.TeamSettingsCardWrapper>
      <Styled.TeamSettingsContainer rtl={rtl}>
        <Breadcrumb items={breadCrumbItems} />

        <Heading type={'h1'}>{'تنظیمات تیم'}</Heading>

        <Styled.FormWrapper>
          <ThumbMaker upload={uploadThumbnail}>
            <Styled.TeamThumbnail src={imgUrl}></Styled.TeamThumbnail>
          </ThumbMaker>

          <Styled.TeamTitle> نام تیم</Styled.TeamTitle>

          <Styled.TeamSubtitle>شعار / تک لاین تیم</Styled.TeamSubtitle>

          <Styled.TeamSubtitle>وبسایت</Styled.TeamSubtitle>

          <Styled.SelectWrapper>
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
          </Styled.SelectWrapper>

          <Styled.SelectWrapper>
            <Styled.SelectTitle>حوزه فعالیت تیم</Styled.SelectTitle>
            <Styled.Select
              classNamePrefix="select"
              placeholder=""
              options={fieldOfExpertiseOption}
              components={{ DropdownIndicator: Indicator }}
            />
          </Styled.SelectWrapper>

          <Styled.SelectWrapper>
            <Styled.SelectTitle>زبان</Styled.SelectTitle>
            <Styled.Select
              classNamePrefix="select"
              isRtl={rtl}
              placeholder=""
              components={{ DropdownIndicator: Indicator }}
            />
          </Styled.SelectWrapper>

          <Styled.SelectWrapper>
            <Styled.SelectTitle>تقویم کلیک مایند</Styled.SelectTitle>
            <Styled.Select
              classNamePrefix="select"
              placeholder=""
              components={{ DropdownIndicator: Indicator }}
            />
          </Styled.SelectWrapper>
        </Styled.FormWrapper>
      </Styled.TeamSettingsContainer>
    </Styled.TeamSettingsCardWrapper>
  );
};

export default TeamSettings;
