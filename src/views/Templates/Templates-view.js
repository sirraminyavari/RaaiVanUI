import { useState, createContext, useEffect } from 'react';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import * as Styled from './Templates-view.styles';
import ActionBar from './TemplatesActionBar';
import TreeList from './TreeList';
import SearchList from './SearchList';
import CreateModal from 'components/Modal/types/create/CreateModal';
import { addNodeType } from 'apiHelper/apiFunctions';
import provideTree from './provideTreeData';
import { getChildNodeTypes } from 'apiHelper/apiFunctions';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import useWindow from 'hooks/useWindowContext';

export const TemplatesViewContext = createContext({});

const DEFAULT_MODAL_STATES = {
  isShown: false,
  title: '',
  type: '',
  content: '',
  inputPlaceholder: '',
  data: null,
};

const modalTypes = {
  class: 'create-class',
  category: 'create-category',
};

const TemplatesView = () => {
  const [modal, setModal] = useState(DEFAULT_MODAL_STATES);
  const [tree, setTree] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [refetchFactor, setRefetchFactor] = useState(0);

  const { GlobalUtilities } = useWindow();

  const breadcrumbItems = [
    { id: 1, title: 'تنظیمات تیم', linkTo: '#' },
    {
      id: 2,
      title: 'تنظیمات کلاس ها',
      linkTo: '#',
    },
  ];

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
  }, [refetchFactor]);

  //! Update modal content on input change.
  const handleModalInputChange = (inputValue) => {
    setModal((oldValues) => ({ ...oldValues, content: inputValue }));
  };

  //! Reset modal
  const resetModal = () => setModal(DEFAULT_MODAL_STATES);

  //! Refetch nodes.
  const refetchNodes = () => setRefetchFactor(GlobalUtilities.random());

  //! Calls after item creation.
  const afterCreate = () => {
    resetModal();
  };

  const createNewCategory = (categoryName) => {
    addNodeType(categoryName)
      .then(() => {
        afterCreate();
      })
      .catch((error) => console.log(error));
  };

  const createNewClass = (className, parentId) => {
    addNodeType(className, parentId, false)
      .then(() => {
        afterCreate();
      })
      .catch((error) => console.log(error));
  };

  //! Fires on create modal click.
  const handleCreate = () => {
    const { content, type, data } = modal;
    //! Return early if user does not provide value.
    if (!content) return;

    if (type === modalTypes?.category) {
      createNewCategory(content);
    } else if (type === modalTypes?.class) {
      createNewClass(content, data?.parentId);
    }
  };

  return (
    <Styled.TemplatesViewContainer>
      <TemplatesViewContext.Provider
        value={{
          modal,
          setModal,
          modalTypes,
          tree,
          setTree,
          searchResult,
          setSearchResult,
          setIsSearching,
          refetchNodes,
        }}>
        <CreateModal
          isOpen={modal?.isShown}
          onInputChange={handleModalInputChange}
          inputValue={modal?.content}
          onCancleCreate={resetModal}
          onCreate={handleCreate}
          modalTitle={modal?.title}
          modalWidth="35%"
          placeholder={modal?.inputPlaceholder}
        />
        <Breadcrumb className="templates-breadcrumb" items={breadcrumbItems} />
        <Styled.TemplatesViewTitle>تنظیمات کلاس ها</Styled.TemplatesViewTitle>
        <ActionBar />
        {isSearching ? (
          <LogoLoader style={{ position: 'relative', top: '3rem' }} />
        ) : !!searchResult.length ? (
          <SearchList />
        ) : (
          <TreeList />
        )}
      </TemplatesViewContext.Provider>
    </Styled.TemplatesViewContainer>
  );
};

export default TemplatesView;
