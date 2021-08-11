/**
 * Renders a multi level filter.
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal/Modal';
import FormFill from 'components/FormElements/FormFill/FormFill';
import FormView from 'components/FormElements/FormView/FormView';
import ExactFilter from 'components/FormElements/FormFilter/items/ExactToggle';
import OrFilter from 'components/FormElements/FormFilter/items/OrAndToggle';
import useWindow from 'hooks/useWindowContext';
import { getChildNodes } from 'apiHelper/apiFunctions';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a multi level type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const MultiLevelType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data || {}; //! Meta data to feed component.

  const { RVDic, GlobalUtilities } = useWindow();

  const { NodeType, Levels } =
    GlobalUtilities.to_json(decodeBase64(Info)) || {};
  const levels = Levels?.map((level) => decodeBase64(level));
  const nodeType = { id: NodeType?.ID, name: decodeBase64(NodeType?.Name) };

  const [nodes, setNodes] = useState([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [viewItems, setViewItems] = useState([]);
  const [exact, setExact] = useState(value ? value?.Exact : false);
  const [or, setOr] = useState(value ? value?.Or : true);

  //! Fires on 'Exact' toggle change.
  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  //! Fires on 'OrAnd' toggle change.
  const handleOrFilter = (orValue) => {
    setOr(orValue);
  };

  //! Fetch nodes for form fill.
  useEffect(() => {
    getChildNodes(nodeType?.id)
      .then((response) => {
        setNodes(response?.Nodes || []);
      })
      .catch((error) => {
        console.log(error);
      });

    //? Due to memory leak error.
    //! Clean up.
    return () => {
      setNodes([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Show modal and form fill to add item.
  const handleOnAdd = () => {
    setIsModalShown(true);
  };

  //! Close modal.
  const handleCloseModal = () => {
    setIsModalShown(false);
  };

  //! Add item to view items.
  const handleOnSelect = (values) => {
    handleCloseModal();
    setViewItems((items) => [...items, values]);
  };

  //! Fires on item remove.
  const handleItemRemove = (removingItem) => {
    const lastLevel = [...levels].pop();
    const removingId = removingItem[lastLevel]?.value?.NodeID;
    const newViewItems = viewItems.filter(
      (item) => item[lastLevel]?.value?.NodeID !== removingId
    );
    setViewItems(newViewItems);
  };

  useEffect(() => {
    const id = ElementID;
    const lastLevel = levels.pop();
    const encodedItems = viewItems?.map((item) => item[lastLevel]?.value?.Name);
    const decodedItems = encodedItems?.map((item) => decodeBase64(item));

    const JSONValue = {
      TextItems: encodedItems,
      Exact: exact,
      Or: or,
    };

    //! Send back value to parent.
    onChange({
      id,
      value: {
        Type: 'multilevel',
        TextItems: decodedItems,
        Exact: exact,
        Or: or,
        JSONValue: !viewItems?.length ? null : JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewItems, exact, or]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setViewItems([]);
    }
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      <FormView.MultiLevel
        items={viewItems}
        levels={levels}
        onItemRemove={handleItemRemove}
      />
      <Button onClick={handleOnAdd}>{RVDic?.Add}</Button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <OrFilter isChecked={or} onToggle={handleOrFilter} />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </div>
      <Modal
        onClose={handleCloseModal}
        title={decodeBase64(Title)}
        show={isModalShown}
        contentWidth="50%">
        <FormFill.MultiLevel
          onSelect={handleOnSelect}
          levels={levels}
          nodes={nodes}
        />
      </Modal>
    </Styled.FilterContainer>
  );
};

MultiLevelType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

MultiLevelType.displayName = 'FilterMultiLevelComponent';

export default MultiLevelType;
