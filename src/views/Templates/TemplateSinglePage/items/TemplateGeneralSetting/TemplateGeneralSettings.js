import * as Styled from './TemplateGeneralSettingsStyles';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { decodeBase64 } from 'helpers/helpers';
import TemplateUploadIcon from './items/TemplateUploadIcon';
import TemplateGeneralSettingSideForm from './sideForm/TemplateGeneralSettingSideForm';
import DeleteTemplateButton from './items/DeleteTemplateButton';
import { MainFormContainer } from './TemplateGeneralSettingsStyles';
import TemplateTitleForm from './items/TemplateTitleForm';
import CMConfidentialitySetting from './CMConfidetialitySetting/CMConfidentialitySetting';
import { PRIVACY_OBJECT_TYPE } from 'apiHelper/ApiHandlers/privacyApi';
import { useState } from 'react';
import RVCheckbox from '../../../../../components/Inputs/RVCheckbox/RVCheckbox';

const TemplateGeneralSettings = () => {
  const { id, title } = useParams();
  const { RVDic, RVGlobal } = window;
  const isSaas = RVGlobal?.SAASBasedMultiTenancy;

  const [test, setTest] = useState(true);

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت قالب ها',
      linkTo: '',
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(title)}`,
      linkTo: '',
    },
    {
      id: 4,
      title: 'عمومی',
      linkTo: '',
    },
  ];
  return (
    <Styled.Container>
      <Styled.MainForm>
        <Breadcrumb items={breadItems} />

        <MainFormContainer>
          <TemplateUploadIcon />
          <TemplateTitleForm name={decodeBase64(title)} />
        </MainFormContainer>

        {isSaas ? (
          <CMConfidentialitySetting type={PRIVACY_OBJECT_TYPE?.NodeType} />
        ) : (
          ''
        )}

        <RVCheckbox
          value="data"
          disabled={true}
          checked={test}
          onChange={(e) => {
            console.log(e?.target);
            console.log(e?.target?.checked);
            setTest(e?.target?.checked);
          }}
        >
          تست
        </RVCheckbox>
      </Styled.MainForm>

      <Styled.SideForm>
        <Styled.SideFormHeader>{'تنظیمات عمومی'}</Styled.SideFormHeader>
        <TemplateGeneralSettingSideForm />

        <DeleteTemplateButton />
      </Styled.SideForm>
    </Styled.Container>
  );
};
export default TemplateGeneralSettings;
