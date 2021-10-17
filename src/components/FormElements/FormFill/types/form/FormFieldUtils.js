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
