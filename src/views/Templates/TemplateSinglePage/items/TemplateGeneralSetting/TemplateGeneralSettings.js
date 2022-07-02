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
import { ReturnButton } from '../../TemplateSinglePageStyles';

const TemplateGeneralSettings = () => {
  const { id, title } = useParams();
  const { RVDic, RV_RTL, RVGlobal } = window;
  const isSaas = RVGlobal?.SAASBasedMultiTenancy;

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

        <ReturnButton rtl={RV_RTL}>{RVDic?.Return}</ReturnButton>
        <MainFormContainer>
          <TemplateUploadIcon />
          {/*<AvatarImageCropper />*/}
          <TemplateTitleForm name={decodeBase64(title)} />
        </MainFormContainer>

        {isSaas ? (
          <CMConfidentialitySetting type={PRIVACY_OBJECT_TYPE?.NodeType} />
        ) : (
          ''
        )}
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
