import { FLEX_RCB, ViewContentCard } from 'constant/StyledCommonCss';
import styled from 'styled-components';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import useWindowContext from 'hooks/useWindowContext';
import Heading from 'components/Heading/Heading';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  addNodeType,
  getNodeTypes,
  removeNodeType,
} from 'apiHelper/ApiHandlers/CNAPI';
import SHTemplates from './items/SHTemplates';
import SaaSTemplates from './items/SaaSTemplates';
import SearchInput from 'components/Inputs/SearchInput';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import TemplateCreateNew from './items/TemplateCreateNew';
import { CV_RED, CV_WHITE } from 'constant/CssVariables';
import ArchiveIcon from 'components/Icons/ArchiveIcon/ArchiveIcon';
import {
  TEMPLATES_ARCHIVE_PATH,
  TEMPLATES_SETTING_SINGLE_PATH,
} from 'constant/constants';
import { useHistory } from 'react-router-dom';
import { decodeBase64 } from 'helpers/helpers';

export const TemplateListContext = createContext({});
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
    },
  ];

  useEffect(() => {
    loadNodeTypes();
  }, [searchText]);

  // useEffect(
  //   () =>
  //     console.log(
  //       data.NodeTypes.map((x) => ({
  //         ...x,
  //         name: decodeBase64(x.TypeName),
  //       }))
  //     ),
  //   [data]
  // );

  //! Redirect to archived templates view.
  const handleGoToArchives = () => {
    history.push(TEMPLATES_ARCHIVE_PATH);
  };

  const loadNodeTypes = useCallback(() => {
    setLoading(true);
    getNodeTypes({
      Icon: true,
      Tree: true,
      Count: 100000,
      CheckAccess: true,
      SearchText: searchText,
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [searchText]);

  const handleAddNodeType = (Name, ParentID, IsCategory = false) => {
    addNodeType({
      Name,
      ParentID,
      IsCategory: isSaaS ? IsCategory || ParentID : undefined,
    }).then((res) => {
      if (res?.Succeed) {
        if (res.NodeType?.IsCategory) loadNodeTypes();
        else
          history.push(
            TEMPLATES_SETTING_SINGLE_PATH.replace(':id', res?.NodeTypeID)
          );
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
      <>
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

        <TemplateListContext.Provider
          value={{
            handleDeleteNode,
            handleAddNodeType,
          }}
        >
          {loading ? (
            <LogoLoader />
          ) : isSaaS ? (
            <SaaSTemplates nodes={data} />
          ) : (
            <SHTemplates nodes={data} />
          )}
        </TemplateListContext.Provider>
      </>
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
const ViewTitle = styled(Heading)`
  margin-bottom: 1.5rem;
`;

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
