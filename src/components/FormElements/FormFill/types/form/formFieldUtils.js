import { cellTypes } from 'components/CustomTable/tableUtils';
import { decodeBase64, toJSON } from 'helpers/helpers';

const getColumnOptions = (column) => {
  switch (column?.Type) {
    case cellTypes.action:
      return {
        editable: false,
        width: 30,
        disableSortBy: true,
      };

    case cellTypes.index:
      return {
        editable: false,
        width: 40,
        disableSortBy: true,
      };

    case cellTypes.text:
      return {
        editable: true,
        isRequired: !!column?.IsRequired,
        maxWidth: 200,
      };

    case cellTypes.singleSelect:
      return {
        editable: true,
        disableSortBy: true,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.multiSelect:
      return {
        editable: true,
        disableSortBy: true,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.date:
      return {
        editable: true,
        minWidth: 170,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.number:
      return {
        editable: true,
        minWidth: 100,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.binary:
      return {
        editable: true,
        disableSortBy: true,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.user:
      return {
        editable: true,
        disableSortBy: true,
        minWidth: 200,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.node:
      return {
        editable: true,
        disableSortBy: true,
        minWidth: 200,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.file:
      return {
        editable: true,
        disableSortBy: true,
        minWidth: 200,
        isRequired: !!column?.IsRequired,
      };

    case cellTypes.recordInfo:
      return {
        // disableSortBy: true,
        minWidth: 170,
      };

    default:
      return {
        editable: true,
        minWidth: 200,
      };
  }
};

export const prepareCell = (cell) => {
  console.log(cell);
  switch (cell?.Type) {
    //! Text cell.
    case cellTypes.text:
      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          text: decodeBase64(cell?.TextValue),
          cell,
        },
      };

    //! Date cell.
    case cellTypes.date:
      const dateArray = cell?.DateValue?.slice(0, 10).split('/');
      const date = [dateArray[2], dateArray[0], dateArray[1]]?.join('/');
      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          date,
          cell,
        },
      };

    //! Select cell.
    case cellTypes.singleSelect:
      const selectInfo = toJSON(decodeBase64(cell?.Info));
      const selectValue = decodeBase64(cell?.TextValue);
      const selectDefaults = !!selectValue
        ? [{ value: selectValue, label: selectValue }]
        : [];
      const selectOptions = selectInfo?.Options?.map((opt) => ({
        value: decodeBase64(opt),
        label: decodeBase64(opt),
      }));

      // console.log({ cell, options, defaultValues }, 'Select');
      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          options: selectOptions,
          defaultValues: selectDefaults,
          cell,
        },
      };

    //! Checkbox cell.
    case cellTypes.multiSelect:
      const checkboxInfo = toJSON(decodeBase64(cell?.Info));
      const checkboxValue = decodeBase64(cell?.TextValue);
      const checkboxDefaults = !!checkboxValue
        ? [{ value: checkboxValue, label: checkboxValue }]
        : [];
      const checkboxOptions = checkboxInfo?.Options?.map((opt) => ({
        value: decodeBase64(opt),
        label: decodeBase64(opt),
      }));

      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          options: checkboxOptions,
          defaultValues: checkboxDefaults,
          cell,
        },
      };

    //! Binary cell.
    case cellTypes.binary:
      const binaryInfo = toJSON(decodeBase64(cell?.Info));
      const binaryValue = decodeBase64(cell?.TextValue);
      const binaryDefaults = !!binaryValue
        ? [{ value: binaryValue, label: binaryValue }]
        : [];
      const binaryOptions = Object.values(binaryInfo).map((opt) => ({
        value: decodeBase64(opt),
        label: decodeBase64(opt),
      }));

      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          options: binaryOptions,
          defaultValues: binaryDefaults,
          cell,
        },
      };

    //! Numeric cell.
    case cellTypes.number:
      const numberInfo = toJSON(decodeBase64(cell?.Info));
      const numberValue = decodeBase64(cell?.TextValue);

      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          text: numberValue,
          numberInfo,
          cell,
        },
      };

    //! Node cell.
    case cellTypes.node:
      const nodeInfo = toJSON(decodeBase64(cell?.Info));
      // console.log(nodeInfo, 'nodeInfo');

      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          nodeInfo,
          cell,
        },
      };

    //! User cell.
    case cellTypes.user:
      const userInfo = toJSON(decodeBase64(cell?.Info));
      // console.log(userInfo, 'userInfo');

      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          userInfo,
          cell,
        },
      };

    //! File cell.
    case cellTypes.file:
      const fileInfo = toJSON(decodeBase64(cell?.Info));
      const files = cell?.Files;
      // console.log(fileInfo, 'fileInfo');

      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          fileInfo,
          cell,
          files,
        },
      };

    //! Otherwise creator info cell.
    default:
      return {
        recordInfo: { cell },
      };
  }
};

export const prepareHeaders = (columns) => [
  {
    id: '0',
    title: '',
    accessor: 'rowAction',
    dataType: cellTypes.action,
    options: getColumnOptions({ Type: cellTypes.action }),
  },
  {
    id: '1',
    title: '#',
    accessor: 'rowIndex',
    dataType: cellTypes.index,
    options: getColumnOptions({ Type: cellTypes.index }),
  },
  ...columns
    .filter((col) => col?.Type !== cellTypes.separator)
    .map((col) => ({
      id: col?.ElementID,
      title: decodeBase64(col?.Title),
      accessor: `${col?.Type}_${col?.ElementID}`,
      dataType: col?.Type,
      options: getColumnOptions(col),
    })),
  {
    id: 'end',
    title: 'اطلاعات ثبت',
    accessor: 'recordInfo',
    dataType: cellTypes.recordInfo,
    options: getColumnOptions({ Type: cellTypes.recordInfo }),
  },
];
