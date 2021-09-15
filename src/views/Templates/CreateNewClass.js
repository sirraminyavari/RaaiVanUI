import { useContext } from 'react';
import * as Styled from './Templates-view.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import { TemplatesViewContext } from './Templates-view';

const CreateNewClass = ({ parent }) => {
  const { setModal, modalTypes } = useContext(TemplatesViewContext);

  const handleAddClass = () => {
    setModal({
      isShown: true,
      title: 'ایجاد کلاس جدید',
      type: modalTypes.class,
      content: '',
      inputPlaceholder: 'ایجاد کلاس',
      data: { parentId: parent?.id },
    });
  };

  return (
    <Styled.NewClassContainer onClick={handleAddClass}>
      <Styled.NewClassWrapper>
        <PlusIcon size={40} />
        <Styled.NewClassLabel>
          <span>ایجاد کلاس جدید</span>
        </Styled.NewClassLabel>
      </Styled.NewClassWrapper>
    </Styled.NewClassContainer>
  );
};

export default CreateNewClass;
