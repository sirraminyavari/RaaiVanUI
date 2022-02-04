import * as Styled from './TemplateGeneralSettingsStyles';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import useWindowContext from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';
import TemplateUploadIcon from './items/TemplateUploadIcon';
const TemplateGeneralSettings = () => {
  const { id, title } = useParams();
  const { RVDic } = useWindowContext();

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
        <TemplateUploadIcon />
      </Styled.MainForm>
      <Styled.SideForm>...</Styled.SideForm>
    </Styled.Container>
  );
};
export default TemplateGeneralSettings;
