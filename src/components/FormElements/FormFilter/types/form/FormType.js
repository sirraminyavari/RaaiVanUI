/**
 * Renders a form filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormFilter from '../../FormFilter';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import * as Styled from '../types.styles';
import { decodeBase64 } from 'helpers/helpers';
import APIHandler from 'apiHelper/APIHandler';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a form type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const FormType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const [isModalShown, setIsModalShown] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterValues, setFilterValues] = useState(value?.JSONValue || {});

  const { FormID, FormName } = JSON.parse(decodeBase64(Info));
  const GetFormElementsAPI = new APIHandler('FGAPI', 'GetFormElements');

  //! Set button title based on selected filters count.
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

  const openModal = () => {
    setIsModalShown(true);
  };

  const closeModal = () => {
    setIsModalShown(false);
  };

  //! Fires on filter click and prepares filters object for parent.
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

  //! Fetch filters and passes them to form.
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
    const id = ElementID;
    const value = filterValues;

    //! Send back value to parent on filter.
    onChange({
      id,
      value: {
        Type: 'form',
        JSONValue: value,
      },
    });
  }, [filterValues]);

  return (
    <Styled.FormContainer>
      <Styled.FormTitle>{decodeBase64(Title)}</Styled.FormTitle>
      <Button onClick={openModal}>{getButtonTitle()}</Button>
      <Modal
        title={decodeBase64(Title)}
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

FormType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

FormType.displayName = 'FilterFormComponent';

export default FormType;
