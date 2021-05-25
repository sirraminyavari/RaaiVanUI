import { useState } from 'react';
import FormFilter from '../../FormFilter';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import * as Styled from '../types.styles';

const FormType = (props) => {
  const { onChange, data } = props;
  const [isModalShown, setIsModalShown] = useState(false);

  const toggleModal = () => {
    setIsModalShown((m) => !m);
  };

  return (
    <Styled.FormContainer>
      <Styled.FormTitle>{data.Title}</Styled.FormTitle>
      <Button onClick={toggleModal}>show modal</Button>
      <Modal title={data.Title} show={isModalShown} contentWidth="50%">
        <FormFilter
          filters={data.Info.filters}
          onFilter={(v) => console.log(v)}
        />
      </Modal>
    </Styled.FormContainer>
  );
};

export default FormType;
