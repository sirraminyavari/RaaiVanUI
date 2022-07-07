import styled from 'styled-components';
import {
  FLEX_RSS,
  ViewContentCard,
} from '../../../../../constant/StyledCommonCss';
import { useParams } from 'react-router-dom';
import * as Styles from './TemplateAdvancedSettingStyles';
import Breadcrumb from '../../../../../components/Breadcrumb/Breadcrumb';
import { decodeBase64 } from '../../../../../helpers/helpers';
import { CV_WHITE, TCV_WARM } from '../../../../../constant/CssVariables';
import RVSideContentSetting from './items/RVSideContentSetting';
import RVMainContentSetting from './items/RVMainContentSetting';

const RVTemplateAdvancedSetting = () => {
  const { RVDic, RV_RTL: rtl } = window;
  const { id, title } = useParams();

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
      title: 'تنظیمات پیشرفته',
      linkTo: '',
    },
  ];

  return (
    <Container>
      <MainContent>
        <Breadcrumb items={breadItems} />
        <Styles.ReturnButton rtl={rtl}>{RVDic?.Return}</Styles.ReturnButton>
        <RVMainContentSetting />
      </MainContent>
      <SideContent>
        <SideContentHeader>{'تنظیمات پیشرفته'}</SideContentHeader>
        <RVSideContentSetting />
      </SideContent>
    </Container>
  );
};
const Container = styled.div`
  ${FLEX_RSS};
  gap: 1rem;
`;

const MainContent = styled.div`
  ${ViewContentCard};
  flex: 1;
`;

const SideContent = styled.div`
  width: 100%;
  max-width: 24rem;
  position: relative;
  box-shadow: 0.06rem 0.29rem 0.98rem #0000001f;
  border-radius: 0.625rem;
  background-color: var(--rv-gray-color-light);
  overflow: hidden;
`;

const SideContentHeader = styled.div`
  width: 100%;
  text-align: center;
  height: 3.75rem;
  line-height: 3.75rem;
  color: ${TCV_WARM};
  font-weight: 500;
  font-size: 1.125rem;
  background-color: ${CV_WHITE};
`;

export default RVTemplateAdvancedSetting;
