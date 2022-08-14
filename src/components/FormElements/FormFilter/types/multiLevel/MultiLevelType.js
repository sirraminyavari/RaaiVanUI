/**
 * Renders a multi level filter.
 */
import { useEffect, useState, useCallback } from 'react';
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

  const { RVDic, GlobalUtilities } = window;

  const { NodeType, Levels } =
    GlobalUtilities.to_json(decodeBase64(Info)) || {};
  const levels = Levels?.map((level) => decodeBase64(level));
  const nodeType = { id: NodeType?.ID, name: decodeBase64(NodeType?.Name) };

  //! Prepare levels for form fill.
  const levelsWithoutOption = levels.reduce((levelList, level, index, self) => {
    const levelObj = {
      id: index,
      name: decodeBase64(level),
      nextLevelName: self[index + 1] ? decodeBase64(self[index + 1]) : null,
      prevLevelName: !!index ? decodeBase64(self[index - 1]) : null,
      options: [],
      selected: null,
    };
    return [...levelList, levelObj];
  }, []);

  const [levelList, setLevelList] = useState(levelsWithoutOption);
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

  //! Get Nodes(options) for each level.
  const getOptions = (id, levelIndex) => {
    const nodeTypeId = !!levelIndex ? '' : id;
    const nodeId = !!levelIndex ? id : '';

    getChildNodes(nodeTypeId, nodeId)
      .then((response) => {
        console.log({ response, id, levelIndex });
        const options = (response?.Nodes || [])?.map((node) => {
          return {
            label: decodeBase64(node?.Name),
            value: node?.NodeID,
          };
        });
        setLevelList((oldLevelList) => {
          const [levelObject] = oldLevelList.splice(levelIndex, 1);

          const levelWithOptions = { ...levelObject, options };

          oldLevelList.splice(levelIndex, 0, levelWithOptions);

          return oldLevelList;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! Fetch options for first level of form fill.
  useEffect(() => {
    if (nodeType?.id) {
      getOptions(nodeType?.id, 0);
    }

    //? Due to memory leak error.
    //! Clean up.
    return () => {
      setLevelList([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Keep track of levels and fetch options for other levels of form fill.
  useEffect(() => {
    const newLevel = levelList.filter((item) => item.selected === null)[0];
    const prevLevel = levelList.filter((item) => item.selected !== null).pop();

    if (!!newLevel && !newLevel.options.length) {
      getOptions(prevLevel?.selected?.value, prevLevel?.id + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelList]);

  //! Fires whenever form select changes.
  const handleChangeFormFill = useCallback((formValue) => {
    // console.log(formValue);
    //! index and value of the current level.
    const { levelIndex, selectedOption } = formValue;
    //! Get levels after current level.
    const nextLevels = levelList.slice(levelIndex + 1);
    //! Set selected value to null for next levels.
    const nextLevelsWithoutValue = nextLevels?.map((level) => {
      return { ...level, selected: null };
    });

    //! Update level list.
    setLevelList((oldLevelList) => {
      //! Extract current level.
      const [levelObject] = oldLevelList.splice(levelIndex, 1);
      //! Append value to current level.
      const levelWithValue = {
        ...levelObject,
        selected: {
          value: selectedOption.value,
          label: selectedOption.label,
        },
      };

      //! Add to list again at correct index.
      oldLevelList.splice(levelIndex, 0, levelWithValue);
      //! Remove levels from current level on to the end, and add non-value levels.
      oldLevelList.splice(levelIndex + 1);

      return [...oldLevelList, ...nextLevelsWithoutValue];
    });
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
  const handleOnConfirm = (values) => {
    setViewItems((items) => [...items, values]);
    handleCloseModal();
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
        }}
      >
        {/* <OrFilter isChecked={or} onToggle={handleOrFilter} />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} /> */}
      </div>
      {levelList && (
        <Modal
          onClose={handleCloseModal}
          title={decodeBase64(Title)}
          show={isModalShown}
          contentWidth="50%"
        >
          <FormFill.MultiLevel
            onConfirm={handleOnConfirm}
            onChange={handleChangeFormFill}
            levels={levelList}
          />
        </Modal>
      )}
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
