import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import GridList from '../items/GridList';
import SearchTemplates from '../items/SearchTemplates';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import * as Styled from './TemplatesArchives.styles';
import { TEMPLATES_SETTING_PATH } from 'constant/constants';
import {
  getChildNodeTypes,
  getNodeTypes,
  recoverNodeType,
} from 'apiHelper/apiFunctions';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';

const TemplatesArchives = () => {
  const { GlobalUtilities, RVDic } = useWindow();
  const [archivedTemplates, setArchivedTemplates] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refetchFactor, setRefetchFactor] = useState(0);
  const allArchivesRef = useRef();
  const history = useHistory();

  const breadcrumbItems = [
    { id: 1, title: 'تنظیمات تیم', linkTo: '#' },
    {
      id: 2,
      title: 'تنظیمات کلاس ها',
      linkTo: TEMPLATES_SETTING_PATH,
    },
    {
      id: 3,
      title: 'بایگانی کلاس‌ها',
      linkTo: '#',
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
    getChildNodeTypes('', '', true)
      .then((response) => {
        if (response?.NodeTypes) {
          setArchivedTemplates(response?.NodeTypes);
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
            setArchivedTemplates(response?.NodeTypes);
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
    <Styled.TemplatesViewContainer>
      <Breadcrumb className="templates-breadcrumb" items={breadcrumbItems} />
      <Button
        onClick={handleClickBack}
        type="negative-o"
        classes="templates-archives-return-button">
        {RVDic.Return}
      </Button>
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
    </Styled.TemplatesViewContainer>
  );
};

export default TemplatesArchives;
