/**
 * Renders multi-level fill form.
 */
import { useState, useEffect } from 'react';
import { decodeBase64, API_Provider } from 'helpers/helpers';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import * as Styled from './MultiLevelCell.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { CN_API, GET_CHILD_NODES } from 'constant/apiConstants';

const getChildNodesAPI = API_Provider(CN_API, GET_CHILD_NODES);

const MultiLevelCell = (props) => {
  // console.log(props, 'multi');
  const {
    value,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRow,
    isNew,
    header,
    data,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  //! Get info for existing row.
  const { Info, SelectedItems } = value || {};
  const selectedItemsName = SelectedItems?.map((item) =>
    decodeBase64(item?.Name)
  );

  const { Levels, NodeType } = Info || columnInfo || {};
  const { ID, Name } = NodeType || {};

  const levels = Levels?.map((level) => decodeBase64(level));

  const initialState = levels.reduce(
    (levelsObject, currentLevel, index, self) => {
      return {
        ...levelsObject,
        [currentLevel]: {
          step: index,
          currentLevel,
          nextLevel: self[index + 1] ?? null,
          prevLevel: !!index ? self[index - 1] : null,
          value: null,
          options: [],
        },
      };
    },
    {}
  );

  const [levelValues, setLevelValues] = useState(initialState);
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);

  //! Keep track of edit mode, And revert to default value if edition has been canceled.
  useEffect(() => {
    if (!isRowEditing) {
      setLevelValues(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRowEditing]);

  useEffect(() => {
    //! If true, All select field are filled.
    let levelsArray = Object.values(levelValues);
    const isCompleted = levelsArray?.every((item) => item.value !== null);

    if (isCompleted) {
      if (isNew) {
        //! New row functionality
      } else {
        let selectedItems = levelsArray?.map((level) => {
          let { Name, NodeID } = level.value;
          return {
            AdditionalID: '',
            Code: '',
            ID: NodeID,
            Name: decodeBase64(Name),
            NodeID,
          };
        });
        const multiLevelCell = {
          ...value,
          SelectedItems: selectedItems,
          GuidItems: selectedItems,
        };
        onCellChange(rowId, columnId, multiLevelCell, selectedItems);
      }
    }
  }, [levelValues]);

  //! Calls on input change.
  const handleChange = (selectedOption, levelObject) => {
    const {
      prevLevel,
      currentLevel: level,
      nextLevel,
      step: currentStep,
      value,
      options,
    } = levelObject;

    //! Array of next levels name.
    const nextLevelsName = levels.slice(currentStep + 1);

    //! Next levels that their value must set to default.
    const nextLevelsValue = nextLevelsName.reduce((acc, level) => {
      return {
        ...acc,
        [level]: { ...levelValues[level], value: null, options: [] },
      };
    }, {});

    //! Extract selected value from it's option list.
    const currentLevelValue = levelValues[level].options.find(
      (item) => decodeBase64(item.Name) === selectedOption
    );

    setLevelValues((oldValues) => ({
      ...oldValues,
      [level]: { ...oldValues[level], value: currentLevelValue },
      ...nextLevelsValue,
    }));
  };

  useEffect(() => {
    //! Get level that does not have value.
    const currentLevel = Object.values(levelValues).filter(
      (item) => item.value === null
    )[0];

    //! The last level that has value.
    const prevLevel = Object.values(levelValues)
      .filter((item) => item.value !== null)
      .pop();

    //! Check if current level does not have options, then fetch it's options.
    if (currentLevel && !currentLevel.options?.length) {
      let fetchOptions;
      //! Get fetch options based on level step.
      if (!prevLevel) {
        //! First level.
        fetchOptions = { NodeTypeID: ID };
      } else {
        //! Child levels.
        fetchOptions = { NodeID: prevLevel?.value?.NodeID };
      }

      prevLevel && setIsFetchingOptions(true);
      //! Fetch select options.
      getChildNodesAPI.fetch(
        { ...fetchOptions },
        (response) => {
          setIsFetchingOptions(false);
          //! Update level values.
          setLevelValues((oldValues) => ({
            ...oldValues,
            [currentLevel.currentLevel]: {
              ...currentLevel,
              options: response.Nodes,
            },
          }));
        },
        (error) => {
          console.log(error);
          setIsFetchingOptions(false);
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelValues]);

  //! Show mode and not new.
  if (!canEdit && !isNew) {
    return !!SelectedItems?.length ? (
      <Styled.CellView type="h4">
        {selectedItemsName.join(' / ')}
      </Styled.CellView>
    ) : (
      <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
    );
  }

  return (
    <div>
      {Object.entries(levelValues || {})?.map((level, key) => {
        const [levelName, currentLevel] = level;
        const selectedLevelName = decodeBase64(currentLevel?.value?.Name);

        //! Options for each select.
        const options = currentLevel?.options?.map((option) => ({
          value: decodeBase64(option?.Name),
          label: decodeBase64(option?.Name),
        }));

        //! Check if select should be shown.
        const isShown =
          currentLevel?.step === 0 || //! Either is first level,
          !!currentLevel?.options.length || //! Or has got options,
          (canEdit && SelectedItems.length); //! Or is in Edit mode.

        //! Get user selected value.
        const value = !!currentLevel?.value
          ? {
              value: selectedLevelName,
              label: selectedLevelName,
            }
          : null;

        //! Get value for the select component.
        const selectValue = isNew
          ? undefined
          : SelectedItems.length
          ? undefined
          : value;

        //! Get default value if it has selected items.
        const selectDefaultValue = isNew
          ? undefined
          : SelectedItems?.map((item) => ({
              value: decodeBase64(item?.Name),
              label: decodeBase64(item?.Name),
            }))?.[currentLevel?.step];

        return (
          <Styled.SelectWrapper key={key} isShown={isShown}>
            <CustomSelect
              defaultValue={selectDefaultValue}
              value={selectValue}
              placeholder={levelName}
              selectOptions={options}
              selectStyles={Styled.customStyles}
              onChange={(option) => handleChange(option?.value, currentLevel)}
              isSearchable
            />
          </Styled.SelectWrapper>
        );
      })}
      {isFetchingOptions && <LogoLoader lottieWidth="3rem" />}
    </div>
  );
};

export default MultiLevelCell;
