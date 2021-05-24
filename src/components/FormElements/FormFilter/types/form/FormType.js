import { useState, useEffect } from 'react';
import FormFilter from '../../FormFilter';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import * as Styled from '../types.styles';
import { decodeBase64 } from 'helpers/helpers';
import APIHandler from 'apiHelper/APIHandler';

const FormType = (props) => {
  const { onChange, data } = props;
  const [isModalShown, setIsModalShown] = useState(false);
  const [filters, setFilters] = useState([]);

  const { FormID, ElementID } = data;

  const GetFormElementsAPI = new APIHandler('FGAPI', 'GetFormElements');

  const toggleModal = () => {
    setIsModalShown((m) => !m);
  };

  useEffect(() => {
    GetFormElementsAPI.fetch(
      {
        FormID,
        OwnerID: ElementID,
        ConsiderElementLimits: true,
      },
      (response) => {
        // const groupingElements = response.Elements.filter((el) => {
        //   return ['Select', 'Binary'].some((item) => item === el.Type);
        // });
        const filters = response.Elements;
        setFilters(filters);
      },
      (error) => console.log(error)
    );
  }, []);

  return (
    <Styled.FormContainer>
      <Styled.FormTitle>{decodeBase64(data.Title)}</Styled.FormTitle>
      <Button onClick={toggleModal}>show modal</Button>
      <Modal
        title={decodeBase64(data.Title)}
        show={isModalShown}
        contentWidth="50%">
        {filters.length && (
          <FormFilter filters={filters} onFilter={(v) => console.log(v)} />
        )}
      </Modal>
    </Styled.FormContainer>
  );
};

export default FormType;
