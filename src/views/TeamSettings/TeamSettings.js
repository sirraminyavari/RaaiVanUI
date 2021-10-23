import * as Styled from './TeamSettingsStyle';
import useTeamSettings from './useTeamSettings';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Heading from '../../components/Heading/Heading';
import ThumbMaker from './items/ThumbMaker';
import Select from '../../components/Inputs/select/Select';
import { TeamSelect } from './items/CustomSelectStyle';

const TeamSettings = (props) => {
  const { rtl, breadCrumbItems, imgUrl, uploadThumbnail } = useTeamSettings(
    props
  );

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
            <Styled.SelectTitle>حوزه فعالیت تیم</Styled.SelectTitle>
            <Select options={[]} name="" />
          </Styled.SelectWrapper>

          <Styled.SelectWrapper>
            <Styled.SelectTitle>زبان</Styled.SelectTitle>
            <Select options={[]} name="" />
          </Styled.SelectWrapper>

          <Styled.SelectWrapper>
            <Styled.SelectTitle>تاریخ</Styled.SelectTitle>
            <Select options={[]} name="" />
          </Styled.SelectWrapper>

          <Styled.Select classNamePrefix="select"></Styled.Select>
        </Styled.FormWrapper>
      </Styled.TeamSettingsContainer>
    </Styled.TeamSettingsCardWrapper>
  );
};

export default TeamSettings;
