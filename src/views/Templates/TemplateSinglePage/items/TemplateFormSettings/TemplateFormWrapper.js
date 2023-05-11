import * as Styled from './TemplateFormSettingsStyles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import PreviewIcon from 'components/Icons/PreviewIcon/PreviewIcon';
import TrashIcon from 'components/Icons/TrashIcon';
import SaveIcon from 'components/Icons/SaveIcon/Save';
import DndHandler from './items/DndHandler';
import { useTemplateContext } from '../../TemplateProvider';
import { useTemplateFormContext } from './TemplateFormContext';
import { useMemo, useState } from 'react';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';
import { useHistory } from 'react-router-dom';
import { TEMPLATES_SETTING_SINGLE_PATH } from 'constant/constants';
import Modal from 'components/Modal/Modal';
import OnboardingTemplateSelectionNode from 'views/Onboarding/items/content/OnboardingTemplateSelection/OnboardingTemplateSelectionNode';

const TemplateFormWrapper = () => {
  const { RV_RTL: rtl } = window;
  const { Title, NodeTypeID } = useTemplateContext();
  const history = useHistory();
  const { saveForm, formObjects } = useTemplateFormContext();
  const [showcaseModalStatus, setShowcaseModalStatus] = useState(false);

  const previewMockFormGenerator = useMemo(
    () =>
      (formObjects || []).map((item) => ({
        BitValue: null,
        CreationDate: '',
        DateValue: null,
        DateValue_Jalali: null,
        EditionsCount: 0,
        Filled: false,
        FloatValue: null,
        FormID: '',
        GuidItems: [],
        Help: '',
        InstanceID: '',
        IsWorkFlowField: false,
        LastModificationDate: '',
        Name: '',
        Necessary: false,
        SelectedItems: [],
        SequenceNumber: 1,
        TextValue: '',
        ...item.data,
        ElementID: item.id,
        Value: '',
        Info: encodeBase64(JSON.stringify(item.data.Info)),
      })),
    [formObjects]
  );

  const returnToTemplates = () =>
    history.push(TEMPLATES_SETTING_SINGLE_PATH.replace(':id', NodeTypeID));
  return (
    <Styled.Container rtl={rtl}>
      <Styled.ActionHeader rtl={rtl}>
        <Styled.Spacer />

        <Button type="secondary-o" onClick={() => setShowcaseModalStatus(true)}>
          <PreviewIcon size={17} />
          <Styled.ButtonTitle>{'پیش‌نمایش'}</Styled.ButtonTitle>
        </Button>
        <Modal
          middle
          title="پیش‌نمایش"
          show={showcaseModalStatus}
          contentWidth="clamp(18rem,85%,50rem)"
          onClose={() => setShowcaseModalStatus(false)}
        >
          <OnboardingTemplateSelectionNode
            Elements={previewMockFormGenerator}
          />
        </Modal>

        <FormDeleteButton onDelete={() => saveForm(true)} />

        <Styled.CustomDropdownMenu
          data={[
            {
              colorClass: 'rv-default',
              icon: <SaveIcon size={17} />,
              label: 'انتشار فرم و بازگشت',
              value: 'saveAndExit',
            },
          ]}
          onSelectItem={(e) => {
            saveForm();
            returnToTemplates();
          }}
          onDropDownOpen={() => {}}
          defaultValue={{
            colorClass: 'rv-default',
            icon: <SaveIcon size={17} />,
            label: 'انتشار فرم',
            value: 'save',
          }}
          hiddenSelectedItem={false}
          onClickLabel={() => {
            saveForm();
          }}
        />
      </Styled.ActionHeader>

      <Styled.MainContent>
        <DndHandler />
      </Styled.MainContent>
    </Styled.Container>
  );
};

const FormDeleteButton = ({ onDelete }) => {
  const { RVDic } = window;
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'حذف فرم',
    messageWarning:
      '. پس از انتخاب حذف فرم، تمامی فیلدها حذف خواهند شد آیتم‌هایی که قبلا تکمیل شده‌اند بدون تغییر باقی خواهند .ماند ولی آیتم‌های جدید شامل فرم فعلی نخواهند بود',
    messageTitle: 'آیا از این کار اطمینان دارید؟',
    confirmText: 'حذف فرم',
    cancelText: 'بازگشت',
  });

  const close = () => setModalInfo({ ...modalInfo, show: false });

  const open = () => setModalInfo({ ...modalInfo, show: true });

  const confirm = () => {
    // confirm
    onDelete && onDelete();
    close();
  };

  return (
    <>
      <Button type="negative-o" onClick={open}>
        <TrashIcon size={17} />
        <Styled.ButtonTitle>{'حذف فرم'}</Styled.ButtonTitle>
      </Button>

      <DeleteConfirmModal
        onClose={close}
        onCancel={close}
        onConfirm={confirm}
        {...modalInfo}
      />
    </>
  );
};
export default TemplateFormWrapper;
