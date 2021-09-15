import { useContext, useState, useEffect } from 'react';
import * as Styled from './Templates-view.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import ArchiveIcon from 'components/Icons/ArchiveIcon/ArchiveIcon';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import { CV_DISTANT, CV_RED, CV_WHITE } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import { TemplatesViewContext } from './Templates-view';
import { getChildNodeTypes, getNodeTypes } from 'apiHelper/apiFunctions';
import provideTree from './provideTreeData';

const TemplatesActionBar = () => {
  const { RVDic } = useWindow();
  const [loadArchives, setLoadArchives] = useState(false);
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

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleFetchArchives = () => {
    setLoadArchives((v) => !v);
  };

  useEffect(() => {
    getChildNodeTypes('', '', loadArchives)
      .then((response) => {
        // console.log({ response });
        setTree(provideTree(response));
      })
      .catch((err) => console.log(err));

    return () => {
      setTree({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadArchives]);

  useEffect(() => {
    if (searchText.length > 2) {
      setIsSearching(true);

      getNodeTypes(searchText, loadArchives)
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
  }, [searchText, loadArchives]);

  return (
    <Styled.TemplatesActionContainer>
      <Styled.SearchInputWrapper>
        <Input
          type="text"
          style={{ width: '100%' }}
          placeholder="فیلتر بر اساس نام کلاس"
          onChange={handleChangeInput}
        />
        <SearchIcon
          size={20}
          color={CV_DISTANT}
          className="templates-view-input-icon"
        />
      </Styled.SearchInputWrapper>
      <Styled.ActionButtonsWrapper>
        <Styled.ButtonWrapper onClick={handleFetchArchives}>
          <ArchiveIcon
            size={16}
            color={loadArchives ? CV_WHITE : CV_RED}
            className="archives-class-icon"
          />
          <Button
            data-type="archive"
            classes={
              loadArchives
                ? 'archives-class-button-active'
                : 'archives-class-button'
            }
            type={loadArchives ? 'negative' : 'negative-o'}>
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
