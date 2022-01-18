import { useRef, useState } from 'react';
import * as Styled from './BinaryCell.styles';
import { decodeBase64 } from 'helpers/helpers';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import useWindow from 'hooks/useWindowContext';

const BinaryCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    editByCell,
  } = useCellProps(props);

  const toggleRef = useRef();
  const { RVDic } = useWindow();

  const { Info, TextValue, BitValue } = value || {};
  const { Yes, No } = Info || {};

  const binaryOptions = { yes: decodeBase64(Yes), no: decodeBase64(No) };

  let toggleValue = isNewRow && !TextValue ? null : BitValue;

  const [toggleSelect, setToggleSelect] = useState({
    value: toggleValue,
    label:
      toggleValue === null
        ? null
        : !!toggleValue
        ? binaryOptions.yes
        : binaryOptions.no,
  });

  //! Options for select component.
  const binarySelectOptions = [
    { value: null, label: null },
    { value: true, label: binaryOptions.yes },
    { value: false, label: binaryOptions.no },
  ];

  //! Handle click outside event.
  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
      updateCell(toggleSelect.value);
    }
  };

  //! A hook that fires a callback when the user clicks outside of the current cell.
  useOnClickOutside(toggleRef, handleClickOutside);

  //! Update cell value on select menu close.
  const handleMenuClose = () => {
    !editByCell && updateCell(toggleSelect.value);
  };

  //! Update cell value.
  const updateCell = (toggle) => {
    let textValue = !!toggle ? binaryOptions.yes : binaryOptions.no;

    if (toggle === null) {
      textValue = '';
    }

    let binaryCell = {
      ...value,
      BitValue: toggle,
      TextValue: textValue,
    };

    onCellChange(rowId, columnId, binaryCell, value);
  };

  //! Handle select value change.
  const handleSelectChange = (selected) => {
    setToggleSelect(selected);
  };

  //! UI for none editing cell.
  if (!canEdit) {
    return (
      <Styled.CellViewContainer>
        {TextValue ? (
          <Styled.SelectedItem className="table-binary-view" type="h6">
            {TextValue}
          </Styled.SelectedItem>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </Styled.CellViewContainer>
    );
  }

  //! UI for editing cell.
  return (
    <Styled.BinaryCellWrapper ref={toggleRef}>
      <CustomSelect
        value={toggleSelect}
        isMulti={false}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        isClearable={false}
        isSearchable={true}
        placeholder={RVDic.Select}
        options={binarySelectOptions}
        onChange={handleSelectChange}
        onMenuClose={handleMenuClose}
        styles={Styled.selectStyles}
        menuPortalTarget={document.body}
        menuShouldScrollIntoView={false}
      />
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
