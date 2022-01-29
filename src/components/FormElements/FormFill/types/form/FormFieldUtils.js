import { cellTypes } from 'components/CustomTable/tableUtils';

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
      return { disableSortBy: true, maxWidth: 200 };

    case cellTypes.singleSelect:
      return { disableSortBy: true, minWidth: 135 };

    case cellTypes.multiSelect:
      return { disableSortBy: true, minWidth: 135 };

    case cellTypes.date:
      return { minWidth: 200 };

    case cellTypes.number:
      return { minWidth: 150 };

    case cellTypes.binary:
      return { disableSortBy: true, minWidth: 150 };

    case cellTypes.user:
      return { disableSortBy: true, minWidth: 260 };

    case cellTypes.node:
      return { disableSortBy: true, minWidth: 260 };

    case cellTypes.file:
      return { disableSortBy: true, minWidth: 260 };

    case cellTypes.table:
      return { disableSortBy: true, width: 170, minWidth: 170, maxWidth: 170 };

    case cellTypes.multiLevel:
      return { disableSortBy: true, minWidth: 220 };

    // case cellTypes.recordInfo:
    //   return {
    //     disableSortBy: true,
    //     minWidth: 190,
    //   };

    default:
      return {
        editable: true,
        minWidth: 200,
        disableSortBy: true,
      };
  }
};