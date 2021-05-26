import { useState, useEffect } from 'react';
import FormFilter from '../../FormFilter';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import * as Styled from '../types.styles';
import { decodeBase64 } from 'helpers/helpers';
import APIHandler from 'apiHelper/APIHandler';

const FormType = (props) => {
  const { onChange, data, value } = props;
  const [isModalShown, setIsModalShown] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterValues, setFilterValues] = useState(value || {});

  const getButtonTitle = () => {
    const filtersCount = Object.values(filterValues).filter(
      (filter) => !!filter.JSONValue
    ).length;
    if (filtersCount) {
      return `${filtersCount} فیلتر انتخاب شده, برای تغییر کلیک کنید.`;
    } else {
      return 'هیچ فیلتری انتخاب نشده, برای تغییر کلیک کنید';
    }
  };

  const { Info, ElementID } = data;
  const { FormID, FormName } = JSON.parse(decodeBase64(Info));
  const GetFormElementsAPI = new APIHandler('FGAPI', 'GetFormElements');

  const openModal = () => {
    setIsModalShown(true);
  };

  const closeModal = () => {
    setIsModalShown(false);
  };

  const handleOnFilter = (filters) => {
    const filtersObject = Object.entries(filters).reduce(
      (filterObject, array) => {
        return { ...filterObject, [array[0]]: array[1] };
      },
      {}
    );

    setFilterValues(filtersObject);
    setIsModalShown(false);
  };

  useEffect(() => {
    GetFormElementsAPI.fetch(
      {
        FormID,
        OwnerID: ElementID,
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

  useEffect(() => {
    const id = data.ElementID;
    const value = filterValues;

    onChange({ id, value });
  }, [filterValues]);

  return (
    <Styled.FormContainer>
      <Styled.FormTitle>{decodeBase64(data.Title)}</Styled.FormTitle>
      <Button onClick={openModal}>{getButtonTitle()}</Button>
      <Modal
        title={decodeBase64(data.Title)}
        show={isModalShown}
        onClose={closeModal}
        contentWidth="50%">
        {filters.length && (
          <FormFilter
            formName={decodeBase64(FormName)}
            filters={filters}
            onFilter={handleOnFilter}
            filterValues={filterValues}
          />
        )}
      </Modal>
    </Styled.FormContainer>
  );
};

export default FormType;
