import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as Styled from './TemplatesSettings.styles';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import ArchiveIcon from 'components/Icons/ArchiveIcon/ArchiveIcon';
import Button from 'components/Buttons/Button';
import { CV_RED, CV_WHITE } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import { TemplatesViewContext } from './TemplatesSettings';
import { getChildNodeTypes, getNodeTypes } from 'apiHelper/apiFunctions';
import provideTree from './provideTreeData';
import { TEMPLATES_ARCHIVE_PATH } from 'constant/constants';
import SearchTemplates from '../items/SearchTemplates';

const TemplatesActionBar = () => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const {
    setModal,
    modalTypes,
    setTree,
    setSearchResult,
    setIsSearching,
  } = useContext(TemplatesViewContext);

  const handleAddCategory = () => {
    setModal({
      isShown: true,
      title: 'ایجاد دسته جدید',
      type: modalTypes.category,
      content: '',
      inputPlaceholder: 'ایجاد دسته',
      data: null,
    });
  };

  //! Calls on search input change.
  const handleChangeInput = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
  };

  //! Redirect to archived templates view.
  const handleGoToArchives = () => {
    history.push(TEMPLATES_ARCHIVE_PATH);
  };

  //! Get node types and provide tree.
  useEffect(() => {
    getChildNodeTypes()
      .then((response) => {
        // console.log({ response });
        setTree(provideTree(response));
      })
      .catch((err) => console.log(err));

    return () => {
      setTree({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Search between nodes on search input change.
  useEffect(() => {
    if (searchText.length > 2) {
      setIsSearching(true);

      getNodeTypes(searchText)
        .then((response) => {
          setSearchResult(response?.NodeTypes);
          setIsSearching(false);
        })
        .catch((error) => {
          console.log(error);
          setIsSearching(false);
        });
    } else {
      setSearchResult([]);
    }

    return () => {
      setIsSearching(false);
      setSearchResult([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <Styled.TemplatesActionContainer>
      <SearchTemplates onChange={handleChangeInput} />
      <Styled.ActionButtonsWrapper>
        <Styled.ButtonWrapper>
          <ArchiveIcon
            size={16}
            color={CV_RED}
            className="archives-class-icon"
          />
          <Button
            data-type="archive"
            classes="archives-class-button"
            type="negative-o"
            onClick={handleGoToArchives}>
            {RVDic.Archive}
          </Button>
        </Styled.ButtonWrapper>

        <Styled.ButtonWrapper onClick={handleAddCategory}>
          <AddIcon size={20} color={CV_WHITE} className="add-class-icon" />
          <Button classes="add-class-button" type="primary">
            ایجاد دسته جدید
          </Button>
        </Styled.ButtonWrapper>
      </Styled.ActionButtonsWrapper>
    </Styled.TemplatesActionContainer>
  );
};

export default TemplatesActionBar;
