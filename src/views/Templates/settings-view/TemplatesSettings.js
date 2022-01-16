import { FLEX_RCB, FLEX_RSB, ViewContentCard } from 'constant/StyledCommonCss';
import styled from 'styled-components';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import useWindowContext from 'hooks/useWindowContext';
import Heading from 'components/Heading/Heading';
import { useEffect, useState } from 'react';
import {
  addNodeType,
  getChildNodeTypes,
  getNodeTypes,
  removeNode,
  removeNodeType,
} from 'apiHelper/ApiHandlers/CNApi';
import SHTemplates from './items/SHTemplates';
import SaaSTemplates from './items/SaaSTemplates';
import SearchInput from 'components/Inputs/SearchInput';
import LogoLoader from '../../../components/Loaders/LogoLoader/LogoLoader';
import TemplateCreateNew from './items/TemplateCreateNew';
import { CV_RED, CV_WHITE, TCV_DEFAULT } from '../../../constant/CssVariables';
import ArchiveIcon from '../../../components/Icons/ArchiveIcon/ArchiveIcon';
import { TEMPLATES_ARCHIVE_PATH } from '../../../constant/constants';
import { useHistory } from 'react-router-dom';
import { forkJoin } from 'rxjs';

const TemplatesSettings = () => {
  const history = useHistory();
  const { RVDic, RV_RTL, RVGlobal } = useWindowContext();
  const isSaaS = RVGlobal?.SAASBasedMultiTenancy;
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  //! Redirect to archived templates view.
  const handleGoToArchives = () => {
    history.push(TEMPLATES_ARCHIVE_PATH);
  };

  const loadNodeTypes = () => {
    setLoading(true);
    getNodeTypes({
      Icon: true,
      Tree: true,
      Count: 100000,
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleAddNodeType = (Name, ParentID) => {
    addNodeType({
      Name,
      ParentID,
    }).then((res) => {
      if (res?.Succeed) {
        loadNodeTypes();
      }
    });
  };

  const handleDeleteNode = (id) => {
    removeNodeType({ NodeTypeID: id }).then((res) => {
      if (res?.Succeed) {
        loadNodeTypes();
      }
    });
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
          <Spacer />
          <ArchiveButton onClick={handleGoToArchives}>
            <ArchiveIcon size={20} />
            <div>{'بایگانی'}</div>
          </ArchiveButton>
          <TemplateCreateNew onSubmit={handleAddNodeType} />
        </ActionBarContainer>

        {loading ? (
          <LogoLoader />
        ) : isSaaS ? (
          <SaaSTemplates nodes={data} />
        ) : (
          <SHTemplates
            nodes={data}
            handleAddNodeType={handleAddNodeType}
            onDeleteSubmit={handleDeleteNode}
          />
        )}
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
  ${FLEX_RCB};
  width: 100%;
  gap: 1rem;
`;
const Spacer = styled.div`
  flex: 1;
`;
const ArchiveButton = styled.button`
  border: 1px solid transparent;
  outline: none;
  border-radius: 0.8rem;
  height: 3rem;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${CV_RED};
  background-color: ${CV_WHITE};
  gap: 0.5rem;
  font-weight: 500;
  transition: border 0.15s ease-out;
  &:hover {
    border: 1px solid ${CV_RED};
  }
`;
export default TemplatesSettings;
