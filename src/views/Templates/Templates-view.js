import { useState, createContext } from 'react';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import * as Styled from './Templates-view.styles';
import ActionBar from './TemplatesActionBar';
import ClassList from './ClassList';
import CreateModal from 'components/Modal/types/create/CreateModal';
import { addNodeType } from 'apiHelper/apiFunctions';

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

  const breadcrumbItems = [
    { id: 1, title: 'تنظیمات تیم', linkTo: '#' },
    {
      id: 2,
      title: 'تنظیمات کلاس ها',
      linkTo: '#',
    },
  ];

  //! Update modal content on input change.
  const handleModalInputChange = (inputValue) => {
    setModal((oldValues) => ({ ...oldValues, content: inputValue }));
  };

  //! Reset modal
  const resetModal = () => setModal(DEFAULT_MODAL_STATES);

  const createCategory = (categoryName) => {
    addNodeType(categoryName)
      .then((response) => {
        console.log(response);
        resetModal();
      })
      .catch((error) => console.log(error));
  };

  //! Fires on create modal click.
  const handleCreate = () => {
    //! Return early if user does not provide value.
    if (!modal?.content) return;

    if (modal?.type === modalTypes?.category) {
      createCategory(modal?.content);
    } else if (modal?.type === modalTypes?.class) {
      console.group(modal.type, modal);
    }
  };

  return (
    <Styled.TemplatesViewContainer>
      <TemplatesViewContext.Provider value={{ modal, setModal, modalTypes }}>
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
        <ClassList />
      </TemplatesViewContext.Provider>
    </Styled.TemplatesViewContainer>
  );
};

export default TemplatesView;
