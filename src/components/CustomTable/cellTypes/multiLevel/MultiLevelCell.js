/**
 * Renders multi-level fill form.
 */
import { useState, useEffect } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import * as Styled from './MultiLevelCell.styles';
import { getNestedItems } from './utils';

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
  const headerId = header?.id;
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
  const { ID } = NodeType || {};

  const levels = Levels?.map((level) => decodeBase64(level));

  const initialState = levels?.map((level, index, self) => ({
    step: index,
    currentLabel: level,
    nextLabel: !!self?.[index + 1] ? self?.[index + 1] : null,
    prevLabel: !!self?.[index - 1] ? self?.[index - 1] : null,
    value: SelectedItems?.[index],
    defaultValue: selectedItemsName?.[index],
    options: [],
    isLoading: false,
  }));

  const [levelValues, setLevelValues] = useState(initialState);

  //! Keep track of edit mode, And revert to default value if edition has been canceled.
  useEffect(() => {
    if (!isRowEditing) {
      setLevelValues(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRowEditing]);

  //! Update multi level cell.
  const updateCell = (levels) => {
    let id = isNew ? null : rowId;

    let selectedItems = levels?.map((level) => {
      let { Name, NodeID } = level?.value || {};
      return {
        AdditionalID: '',
        Code: '',
        ID: NodeID,
        Name: decodeBase64(Name),
        NodeID,
      };
    });

    let multiLevelCell = isNew
      ? {
          ElementID: headerId,
          SelectedItems: selectedItems,
          GuidItems: selectedItems,
          Type: header?.dataType,
        }
      : {
          ...value,
          SelectedItems: selectedItems,
          GuidItems: selectedItems,
          TextValue: '',
        };

    onCellChange(id, columnId, multiLevelCell, selectedItems);
  };

  //! Get options for each level.
  const getOptions = (step, id) => {
    setLevelValues((previous) =>
      previous.map((level, index) =>
        step === index
          ? {
              ...level,
              isLoading: true,
            }
          : level
      )
    );

    getNestedItems(id, step)
      .then((response) => {
        setLevelValues((previous) =>
          previous.map((level, index) =>
            step === index
              ? {
                  ...level,
                  options: response,
                  isLoading: false,
                }
              : level
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! Calls on input change.
  const handleChange = (selectedOption, levelObject) => {
    let { step: currentStep, options } = levelObject;
    let nextStep = currentStep + 1;
    let isTheEnd = currentStep === levels.length - 1;

    //! Extract selected value from it's option list.
    const currentLevelValue = options.find(
      (item) => decodeBase64(item.Name) === selectedOption
    );

    let newLevelsValue = levelValues.map((level, index) => {
      if (index === currentStep) {
        return {
          ...level,
          value: currentLevelValue,
          defaultValue: selectedOption,
        };
      }
      if (index > currentStep) {
        return {
          ...level,
          value: null,
          defaultValue: null,
          options: [],
        };
      }
      return level;
    });

    setLevelValues(newLevelsValue);

    if (isTheEnd) {
      updateCell(newLevelsValue);
    } else {
      getOptions(nextStep, currentLevelValue.NodeID);
    }
  };

  useEffect(() => {
    if (canEdit) {
      getOptions(0, ID);
    } else {
      setLevelValues(initialState);
    }

    return () => {
      setLevelValues(levelValues);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit]);

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
    <Styled.MultiLevelContainer>
      {levelValues
        ?.filter(
          (level) => !!level.defaultValue || level?.options.length || isNew
        )
        ?.map((level, key, self) => {
          const selectedLevelName = decodeBase64(level?.value?.Name);
          let previousLevel = self?.[level.step - 1];
          let previousSelect = previousLevel?.options.find(
            (option) => decodeBase64(option.Name) === previousLevel.defaultValue
          );

          //! Options for each select.
          const selectOptions = level?.options?.map((option) => ({
            value: decodeBase64(option?.Name),
            label: decodeBase64(option?.Name),
          }));

          //! Get user selected value.
          const value = !!level?.value
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

          //! Get default value if it has any.
          const selectDefaultValue = !!level?.defaultValue
            ? {
                value: level?.defaultValue,
                label: level?.defaultValue,
              }
            : undefined;

          return (
            <Styled.SelectWrapper key={key}>
              <CustomSelect
                defaultValue={selectDefaultValue}
                value={selectValue}
                placeholder={level?.currentLabel}
                options={selectOptions}
                selectStyles={Styled.customStyles}
                onChange={(option) => handleChange(option?.value, level)}
                onFocus={() =>
                  level.step !== 0 &&
                  !level.options.length &&
                  !!previousLevel.options.length &&
                  getOptions(level.step, previousSelect?.NodeID)
                }
                isSearchable
                isLoading={level.isLoading}
              />
            </Styled.SelectWrapper>
          );
        })}
    </Styled.MultiLevelContainer>
  );
};

export default MultiLevelCell;
