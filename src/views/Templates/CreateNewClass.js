import * as Styled from './Templates-view.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';

const CreateNewClass = () => {
  return (
    <Styled.NewClassContainer>
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
