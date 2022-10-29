import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import GridList from '../items/GridList';
import SearchTemplates from '../items/SearchTemplates';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import * as Styled from './TemplatesArchives.styles';
import { TEAM_SETTINGS_PATH, TEMPLATES_SETTING_PATH } from 'constant/constants';
import {
  getChildNodeTypes,
  getNodeTypes,
  recoverNodeType,
} from 'apiHelper/apiFunctions';
import useWindow from 'hooks/useWindowContext';
import ReturnButton from 'components/Buttons/ReturnButton';
import WelcomeLayout from 'layouts/WelcomeLayout';

const TemplatesArchives = () => {
  const { GlobalUtilities, RVDic } = useWindow();
  const [archivedTemplates, setArchivedTemplates] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refetchFactor, setRefetchFactor] = useState(0);
  const allArchivesRef = useRef();
  const history = useHistory();

  const breadcrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: TEAM_SETTINGS_PATH.replace(':id', ''),
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: TEMPLATES_SETTING_PATH,
    },
    {
      id: 3,
      title: 'بایگانی کلاس‌ها',
    },
  ];

  const handleChangeInput = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
  };

  const handleClickBack = () => {
    history.push(TEMPLATES_SETTING_PATH);
  };

  const handleRestoreTemplate = (template) => {
    const nodeId = template?.NodeTypeID;

    recoverNodeType(nodeId)
      .then((response) => {
        console.log(response);
        setRefetchFactor(GlobalUtilities.random());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! Get node types.
  useEffect(() => {
    setIsFetching(true);
    getChildNodeTypes('', '', true, true)
      .then((response) => {
        if (response?.NodeTypes) {
          setArchivedTemplates(
            response?.NodeTypes.filter(({ IsCategory }) => !IsCategory)
          );
          allArchivesRef.current = response?.NodeTypes;
        }
        setIsFetching(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetching(false);
      });

    return () => {
      setArchivedTemplates([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchFactor]);

  useEffect(() => {
    if (searchText.length > 2) {
      setIsFetching(true);

      getNodeTypes(searchText, true)
        .then((response) => {
          if (response?.NodeTypes) {
            console.log(response);
            setArchivedTemplates(
              response?.NodeTypes.filter(({ IsCategory }) => !IsCategory)
            );
          }
          setIsFetching(false);
        })
        .catch((err) => {
          console.log(err);
          setIsFetching(false);
        });
    } else {
      setArchivedTemplates(allArchivesRef.current);
    }

    return () => {
      setArchivedTemplates([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <WelcomeLayout singleColumn withScrollbar>
      <Styled.TemplatesViewBreadcrumbContainer>
        <Breadcrumb className="templates-breadcrumb" items={breadcrumbItems} />
        <ReturnButton onClick={handleClickBack} />
      </Styled.TemplatesViewBreadcrumbContainer>
      <Styled.TemplatesViewTitle>بایگانی کلاس‌ها</Styled.TemplatesViewTitle>
      <SearchTemplates
        onChange={handleChangeInput}
        style={{ marginTop: '2rem' }}
      />
      {isFetching ? (
        <LogoLoader style={{ position: 'relative', top: '3rem' }} />
      ) : (
        <GridList
          isArchive
          onRestore={handleRestoreTemplate}
          style={{ marginTop: '2rem' }}
          templates={archivedTemplates}
        />
      )}
    </WelcomeLayout>
  );
};

export default TemplatesArchives;
