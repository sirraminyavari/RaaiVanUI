import CoverPatternUploader from './CoverPatternUploader';
import * as Styled from './RVMainContentSettingStyles';
import CodingPattern from './CodingPattern';
import CustomSelect from '../../../../../../components/Inputs/CustomSelect/CustomSelect';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import { setServiceSuccessMessage } from 'apiHelper/ApiHandlers/CNAPI/api-service';
import InfoMessage from 'components/toasts/info-toast/InfoMessage';

const RVMainContentSetting = () => {
  const { RVDic } = window;
  const { SuccessMessage, NodeTypeID } = useTemplateContext();

  const AdminOption = [
    {
      id: 1,
      value: '',
      title: 'مسئول ثبت حوزه',
    },
  ];

  const handleTemplateIdStateChange = async (e) => {
    const Message = e?.target?.value;
    const { ErrorText } = await setServiceSuccessMessage({
      NodeTypeID,
      Message,
    });

    if (ErrorText) {
      InfoMessage({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  return (
    <>
      <Styled.UploaderContainer>
        <Styled.UploaderContainerTitle>
          {'PDF الگوی جلد فایل'}
        </Styled.UploaderContainerTitle>
        <Styled.UploaderWrapper>
          <CoverPatternUploader />
        </Styled.UploaderWrapper>
      </Styled.UploaderContainer>

      <Styled.Block>
        <Styled.BlockTitle>{'کددهی و ثبت'}</Styled.BlockTitle>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>{'شناسه تمپلیت'}</Styled.BlockSectionTitle>
          <Styled.BlockSectionInputContainer>
            <Styled.TemplateIdInput
              placeholder={'شناسه تمپلیت'}
              value={SuccessMessage}
              onChange={handleTemplateIdStateChange}
            />
          </Styled.BlockSectionInputContainer>
        </Styled.BlockSection>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>
            {'الگوی کددهی آیتم‌ها'}
          </Styled.BlockSectionTitle>
          <Styled.BlockSectionInputContainer>
            <CodingPattern />
          </Styled.BlockSectionInputContainer>
        </Styled.BlockSection>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>{'پیام موفقیت'}</Styled.BlockSectionTitle>
          <Styled.BlockSectionInputContainer>
            <Styled.SuccessMessageInput placeholder={'پیام موفقیت'} />
          </Styled.BlockSectionInputContainer>
        </Styled.BlockSection>
      </Styled.Block>

      <Styled.Block>
        <Styled.BlockTitle>{'تنظیمات سرویس'}</Styled.BlockTitle>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>
            {'جریان‌های کاری'}
          </Styled.BlockSectionTitle>
          <Styled.ProcessInput placeholder={'جریان‌های کاری'} />
        </Styled.BlockSection>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>{'مسئول'}</Styled.BlockSectionTitle>

          <Styled.AdminInputContainer>
            <CustomSelect
              placeholder=""
              options={AdminOption}
              onChange={(e) => {}}
            />

            <Styled.ProcessInput
              placeholder={'انتخاب کلاس برای محدودیت حوزه'}
            />

            <Styled.ProcessInput
              placeholder={'حداکثر سطح مورد قبول برای مسئول'}
            />
          </Styled.AdminInputContainer>
        </Styled.BlockSection>
      </Styled.Block>
    </>
  );
};
export default RVMainContentSetting;
