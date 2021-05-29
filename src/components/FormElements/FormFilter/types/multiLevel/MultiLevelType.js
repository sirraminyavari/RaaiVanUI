/**
 * Renders a multi level filter.
 */
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64 } from 'helpers/helpers';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../types.styles';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal/Modal';
import { WindowContext } from 'context/WindowProvider';
import FormFill from 'components/FormElements/FormFill/FormFill';
import FormView from 'components/FormElements/FormView/FormView';
import ExactFilter from '../../items/ExactToggle';
import OrFilter from '../../items/OrAndSelect';

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
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const { NodeType, Levels } = JSON.parse(decodeBase64(Info));
  const levels = Levels.map((level) => decodeBase64(level));
  const nodeType = { id: NodeType.ID, name: decodeBase64(NodeType.Name) };
  const getChildNodesAPI = new APIHandler('CNAPI', 'GetChildNodes');
  const { RVDic } = useContext(WindowContext);

  const [nodes, setNodes] = useState([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [viewItems, setViewItems] = useState([]);
  const [exact, setExact] = useState(value ? value.Exact : false);
  const [or, setOr] = useState(value ? value.Or : true);

  //! Options for 'OrAnd' select;
  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

  //! Fires on 'Exact' toggle change.
  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  //! Fires on 'OrAnd' change.
  const handleOrFilter = (orValue) => {
    if (orValue === 'or') {
      setOr(true);
    } else {
      setOr(false);
    }
  };

  //! Fetch nodes for form fill.
  useEffect(() => {
    getChildNodesAPI.fetch(
      { NodeTypeID: nodeType.id },
      (response) => {
        setNodes(response.Nodes);
      },
      (error) => console.log(error)
    );
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
    const removingId = removingItem[lastLevel].value.NodeID;
    const newViewItems = viewItems.filter(
      (item) => item[lastLevel].value.NodeID !== removingId
    );
    setViewItems(newViewItems);
  };

  useEffect(() => {
    const id = ElementID;
    const lastLevel = levels.pop();
    const encodedItems = viewItems.map((item) => item[lastLevel].value.Name);
    const decodedItems = encodedItems.map((item) => decodeBase64(item));

    const JSONValue = {
      TextItems: encodedItems,
      Exact: exact,
      Or: or,
    };

    //! Send back value to parent.
    onChange({
      id,
      value: {
        TextItems: decodedItems,
        Exact: exact,
        Or: or,
        JSONValue: !viewItems.length ? null : JSONValue,
      },
    });
  }, [viewItems, exact, or]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setViewItems([]);
    }
  }, [value]);

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{decodeBase64(Title)}</Styled.UserTitle>
      <FormView.MultiLevel
        items={viewItems}
        levels={levels}
        onItemRemove={handleItemRemove}
      />
      <Button onClick={handleOnAdd}>{RVDic.Add}</Button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <OrFilter
          options={orOptions}
          selectedOption={!!or ? 0 : 1}
          name="multilevel-or-filter"
          onSelect={handleOrFilter}
        />
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
    </Styled.UserContainer>
  );
};

MultiLevelType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

MultiLevelType.displayName = 'FilterMultiLevelComponent';

export default MultiLevelType;
