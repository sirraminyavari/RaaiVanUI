import * as Styled from './TemplateFormSettingsStyles';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import PreviewIcon from 'components/Icons/PreviewIcon/PreviewIcon';
import TrashIcon from 'components/Icons/TrashIcon';
import SaveIcon from 'components/Icons/SaveIcon/Save';
import DndHandler from './items/DndHandler';
import { useTemplateContext } from '../../TemplateProvider';
import { useTemplateFormContext } from './TemplateFormContext';
import { useState } from 'react';

const TemplateFormWrapper = () => {
  const { RV_RTL: rtl } = window;
  const { Title } = useTemplateContext();
  const { saveForm } = useTemplateFormContext();
  return (
    <Styled.Container rtl={rtl}>
      <Styled.ActionHeader rtl={rtl}>
        <Styled.HeaderTitle>{decodeBase64(`${Title}`)}</Styled.HeaderTitle>
        <Styled.Spacer />

        <Button type="secondary-o">
          <PreviewIcon size={17} />
          <Styled.ButtonTitle>{'پیش‌نمایش'}</Styled.ButtonTitle>
        </Button>

        <FormDeleteButton />

        <Button type="primary" onClick={saveForm}>
          <SaveIcon size={17} />
          <Styled.ButtonTitle>{'انتشار فرم'}</Styled.ButtonTitle>
        </Button>
      </Styled.ActionHeader>

      <Styled.MainContent>
        <DndHandler />
      </Styled.MainContent>
    </Styled.Container>
  );
};

const FormDeleteButton = () => {
  const { RVDic } = window;
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'حذف فرم',
  });
  return (
    <Button type="negative-o">
      <TrashIcon size={17} />
      <Styled.ButtonTitle>{'حذف فرم'}</Styled.ButtonTitle>
    </Button>
  );
};
export default TemplateFormWrapper;
