import { FLEX_RSB, ViewContentCard } from 'constant/StyledCommonCss';
import styled from 'styled-components';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import useWindowContext from 'hooks/useWindowContext';
import Heading from 'components/Heading/Heading';
import { useEffect, useState } from 'react';
import { getChildNodeTypes } from 'apiHelper/ApiHandlers/CNApi';
import SHTemplates from './items/SHTemplates';
import SaaSTemplates from './items/SaaSTemplates';
import SearchInput from 'components/Inputs/SearchInput';

const TemplatesSettings = () => {
  const { RVDic, RV_RTL, RVGlobal } = useWindowContext();
  const isSaaS = RVGlobal?.SAASBasedMultiTenancy;
  const [searchText, setSearchText] = useState('');
  const [nodeTypes, setNodeTypes] = useState([]);

  const breadcrumbs = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'تنظیمات تمپلیت‌ها',
      linkTo: '',
    },
  ];

  useEffect(() => {
    loadNodeTypes();
  }, []);

  const loadNodeTypes = () => {
    getChildNodeTypes()
      .then((res) => setNodeTypes(res))
      .catch((err) => console.log(err));
  };

  return (
    <TemplateSettingsContainer rtl={RV_RTL}>
      <ViewCard>
        <Breadcrumb items={breadcrumbs} />
        <ViewTitle>{'تنظیمات تمپلیت‌ها'}</ViewTitle>

        <ActionBarContainer>
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e?.target?.value)}
            placeholder={RVDic?.Search}
            delayTime={1000}
          />
        </ActionBarContainer>

        {isSaaS ? <SaaSTemplates /> : <SHTemplates nodes={nodeTypes} />}
      </ViewCard>
    </TemplateSettingsContainer>
  );
};

const TemplateSettingsContainer = styled.div`
  padding: 1rem;
  direction: ${(props) => (props?.rtl ? 'rtl' : 'ltr')};
`;
const ViewCard = styled.div`
  ${ViewContentCard}
`;
const ViewTitle = styled(Heading)``;

const ActionBarContainer = styled.div`
  ${FLEX_RSB}
`;
export default TemplatesSettings;
