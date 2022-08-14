import CoverPatternUploader from './CoverPatternUploader';
import * as Styled from './RVMainContentSettingStyles';
import CodingPattern from './CodingPattern';
import CustomSelect from '../../../../../../components/Inputs/CustomSelect/CustomSelect';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import { setServiceSuccessMessage } from 'apiHelper/ApiHandlers/CNAPI/api-service';
import InfoMessage from 'components/toasts/info-toast/InfoMessage';
import useAdvancedSetting from '../useAdvancedSetting';
import api from 'apiHelper';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { setNodeTypeAdditionalId } from 'apiHelper/ApiHandlers/CNAPI';

const RVMainContentSetting = () => {
  const { RVDic } = window;
  const { SuccessMessage, NodeTypeID, AdminType, MaxAcceptableAdminLevel } =
    useTemplateContext();
  const { Pattern, additionalID } = useAdvancedSetting();

  const handleTemplateIdStateChange = async (e) => {
    const AdditionalID = e?.target?.value;
    const { ErrorText } = await setNodeTypeAdditionalId({
      NodeTypeID,
      AdditionalID,
    });

    if (ErrorText) {
      InfoMessage({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  const AdminTypeOptions = [
    {
      id: 1,
      value: 'AreaAdmin',
      label: RVDic.CN.Service.AdminType.AreaAdmin,
    },
    {
      id: 2,
      value: 'ComplexAdmin',
      label: RVDic.CN.Service.AdminType.ComplexAdmin,
    },
    {
      id: 3,
      value: 'SpecificNode',
      label: RVDic.CN.Service.AdminType.SpecificNode,
    },
    {
      id: 4,
      value: 'Registerer',
      label: RVDic.CN.Service.AdminType.Registerer,
    },
  ];

  const handleAdminTypeSelect = async ({ value }) => {
    const { ErrorText } = await api?.CN?.setServiceAdminType({
      NodeTypeID,
      AdminType: value,
    });

    if (ErrorText)
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
  };

  const handleMaxAcceptableAdminLevelStateChange = async (e) => {
    const { value: Level } = e?.target || {};

    const { ErrorText } = await api?.CN?.setMaxAcceptableAdminLevel({
      NodeTypeID,
      Level,
    });

    if (ErrorText)
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
  };

  const handleSuccessMessageStateChange = async (e) => {
    const { value: Message } = e?.target || {};

    const { ErrorText } = await api?.CN?.setServiceSuccessMessage({
      NodeTypeID,
      Message,
    });

    if (ErrorText)
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
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
              pvalue={additionalID}
              laceholder={'شناسه تمپلیت'}
              onChange={handleTemplateIdStateChange}
            />
          </Styled.BlockSectionInputContainer>
        </Styled.BlockSection>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>
            {'الگوی کددهی آیتم‌ها'}
          </Styled.BlockSectionTitle>
          <Styled.BlockSectionInputContainer>
            <CodingPattern pattern={Pattern} />
          </Styled.BlockSectionInputContainer>
        </Styled.BlockSection>

        <Styled.BlockSection>
          <Styled.BlockSectionTitle>
            {RVDic?.SuccessMessage}
          </Styled.BlockSectionTitle>
          <Styled.BlockSectionInputContainer>
            <Styled.SuccessMessageInput
              value={SuccessMessage}
              onChange={handleSuccessMessageStateChange}
              placeholder={RVDic?.SuccessMessage}
            />
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
              options={AdminTypeOptions}
              defaultValue={{
                value: AdminType,
                label:
                  AdminTypeOptions?.find((a) => a?.value === AdminType)
                    ?.label || '',
              }}
              onChange={handleAdminTypeSelect}
            />

            <Styled.ProcessInput
              placeholder={'انتخاب کلاس برای محدودیت حوزه'}
            />

            <Styled.ProcessInput
              value={MaxAcceptableAdminLevel || ''}
              onChange={handleMaxAcceptableAdminLevelStateChange}
              placeholder={'حداکثر سطح مورد قبول برای مسئول'}
            />
          </Styled.AdminInputContainer>
        </Styled.BlockSection>
      </Styled.Block>
    </>
  );
};
export default RVMainContentSetting;
