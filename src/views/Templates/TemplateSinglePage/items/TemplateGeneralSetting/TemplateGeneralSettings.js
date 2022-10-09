import * as Styled from './TemplateGeneralSettingsStyles';
import { useHistory, useParams } from 'react-router-dom';
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
import { useTemplateContext } from '../../TemplateProvider';
import { TEAM_SETTINGS_PATH, TEMPLATES_SETTING_PATH } from 'constant/constants';

const TemplateGeneralSettings = () => {
  const { RVDic, RV_RTL, RVGlobal } = window;
  const isSaas = RVGlobal?.SAASBasedMultiTenancy;
  const { Title } = useTemplateContext();
  const history = useHistory();

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: TEAM_SETTINGS_PATH,
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: TEMPLATES_SETTING_PATH,
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(Title)}`,
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

        <ReturnButton
          $rtl={RV_RTL}
          onClick={() => history.push(TEMPLATES_SETTING_PATH)}
        >
          {RVDic?.Return}
        </ReturnButton>
        <MainFormContainer>
          <div>
            <TemplateUploadIcon />
          </div>
          {/*<AvatarImageCropper />*/}
          <TemplateTitleForm name={decodeBase64(Title)} />
        </MainFormContainer>

        {isSaas ? (
          <CMConfidentialitySetting type={PRIVACY_OBJECT_TYPE?.NodeType} />
        ) : null}
      </Styled.MainForm>

      <Styled.SideForm>
        <Styled.SideFormHeader>{RVDic?.GeneralSettings}</Styled.SideFormHeader>
        <TemplateGeneralSettingSideForm />

        <Styled.Spacer />

        <DeleteTemplateButton />
      </Styled.SideForm>
    </Styled.Container>
  );
};
export default TemplateGeneralSettings;
