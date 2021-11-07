import * as Styled from './TeamSettingsStyle';
import useTeamSettings from './useTeamSettings';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import AnimatedTextArea from './items/AnimatedTextArea';
import Button from '../../components/Buttons/Button';
import CustomSelect from '../../components/Inputs/CustomSelect/CustomSelect';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import CustomSelectIndicator from '../../components/Inputs/CustomSelect/items/CustomSelectIndicator';
import CustomInput from './items/CustomInput';

const TeamSettings = (props) => {
  const {
    rtl,
    DIC,
    breadCrumbItems,
    fieldOfExpertiseOption,
    languageOption,
    calOption,
    teamSizeOption,
    IconURL,
    applicationInfo,
    setApplicationInfo,
    saveInfo,
  } = useTeamSettings(props);

  console.log(applicationInfo);
  return (
    <Styled.TeamSettingsCardWrapper>
      <Styled.TeamSettingsContainer rtl={rtl}>
        <Breadcrumb items={breadCrumbItems} />

        <Styled.PageTitle>{'تنظیمات تیم'}</Styled.PageTitle>

        <Styled.FormWrapper>
          <Styled.TeamThumbnailContainer>
            <ImageCropper
              isEditable={true}
              uploadType="ApplicationIcon"
              uploadId={applicationInfo?.ApplicationID}
              image={IconURL}
            />
          </Styled.TeamThumbnailContainer>

          <CustomInput
            placeholder={'نام تیم'}
            value={applicationInfo.Title}
            onChange={(e) =>
              setApplicationInfo({ ...applicationInfo, Title: e.target.value })
            }
          />

          <CustomInput
            placeholder={'شعار / تک لاین تیم'}
            light={true}
            value={applicationInfo?.Tagline}
            onChange={(e) =>
              setApplicationInfo({
                ...applicationInfo,
                Tagline: e.target.value,
              })
            }
          />

          <CustomInput
            placeholder={'وبسایت'}
            light={true}
            value={applicationInfo.Website}
            onChange={(e) =>
              setApplicationInfo({
                ...applicationInfo,
                Website: e.target.value,
              })
            }
          />

          <Styled.FieldWrapper>
            <Styled.SelectTitle>حوزه فعالیت تیم</Styled.SelectTitle>
            <CustomSelect
              placeholder=""
              options={fieldOfExpertiseOption}
              components={{
                DropdownIndicator: CustomSelectIndicator,
              }}
              classNamePrefix="select"
              defaultValue={{
                value: applicationInfo?.ExpertiseFieldID,
                label: applicationInfo?.ExpertiseFieldName,
              }}
              onChange={(e) =>
                setApplicationInfo({
                  ...applicationInfo,
                  ExpertiseFieldID: e.value,
                  ExpertiseFieldName: e.label,
                })
              }
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
              defaultValue={{
                value: applicationInfo?.Size,
                label: teamSizeOption.find(
                  (x) => x.value === applicationInfo?.Size
                )?.label,
              }}
              onChange={(e) =>
                setApplicationInfo({
                  ...applicationInfo,
                  Size: e.value,
                })
              }
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
              defaultValue={{
                value: applicationInfo?.Language,
                label: languageOption.find(
                  (x) => x.value === applicationInfo?.Language
                )?.label,
              }}
              onChange={(e) =>
                setApplicationInfo({
                  ...applicationInfo,
                  Language: e.value,
                })
              }
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
              defaultValue={{
                value: applicationInfo?.Calendar,
                label: calOption.find(
                  (x) => x.value === applicationInfo?.Calendar
                )?.label,
              }}
              onChange={(e) =>
                setApplicationInfo({
                  ...applicationInfo,
                  Calendar: e.value,
                })
              }
            />
          </Styled.FieldWrapper>

          <Styled.FieldWrapper>
            <AnimatedTextArea
              autoresize={true}
              label={'درباره تیم'}
              rtl={rtl}
              value={applicationInfo?.About}
              onChange={(e) =>
                setApplicationInfo({
                  ...applicationInfo,
                  About: e.target.value,
                })
              }
            />
          </Styled.FieldWrapper>

          <Styled.SettingActionBar>
            <Button type="primary" onClick={saveInfo}>
              ذخیره
            </Button>
          </Styled.SettingActionBar>
        </Styled.FormWrapper>
      </Styled.TeamSettingsContainer>
    </Styled.TeamSettingsCardWrapper>
  );
};

export default TeamSettings;
