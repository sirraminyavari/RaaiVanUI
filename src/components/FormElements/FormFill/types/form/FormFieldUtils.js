import saveForm from '../saveForm';
import { cellTypes } from 'components/CustomTable/tableUtils';

export const saveRowElements = (elements) => {
  const readyToSaveElements = elements.map((element) => {
    const {
      ElementID,
      RefElementID,
      BitValue,
      DateValue,
      Filled,
      FloatValue,
      SelectedItems,
      TextValue,
      Type,
      Files,
      TableColumns,
      TableContent,
      GuidItems,
    } = element || {};

    switch (element.Type) {
      case cellTypes.date:
        return { ElementID, RefElementID, DateValue, Filled: true, Type };

      case cellTypes.text:
        return { ElementID, RefElementID, TextValue, Filled: true, Type };

      default:
        return element;
    }
  });

  // console.log(readyToSaveElements);

  return saveForm(readyToSaveElements);
};

export const getTableOptions = (column) => {
  switch (column?.Type) {
    case cellTypes.action:
      return {
        editable: false,
        width: 35,
        disableSortBy: true,
      };

    case cellTypes.index:
      return {
        editable: false,
        width: 40,
        disableSortBy: true,
      };

    case cellTypes.text:
      return { maxWidth: 200 };

    case cellTypes.singleSelect:
      return { disableSortBy: true, minWidth: 135 };

    case cellTypes.multiSelect:
      return { disableSortBy: true, minWidth: 135 };

    case cellTypes.date:
      return { minWidth: 200 };

    case cellTypes.number:
      return { minWidth: 150 };

    case cellTypes.binary:
      return { disableSortBy: true };

    case cellTypes.user:
      return { disableSortBy: true, minWidth: 260 };

    case cellTypes.node:
      return { disableSortBy: true, minWidth: 260 };

    case cellTypes.file:
      return { disableSortBy: true, minWidth: 260 };

    // case cellTypes.recordInfo:
    //   return {
    //     disableSortBy: true,
    //     minWidth: 190,
    //   };

    default:
      return {
        editable: true,
        minWidth: 200,
      };
  }
};
