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
        minWidth: 220,
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
    //! Text Type.
    case cellTypes.text:
      return {
        [`${cell?.Type}_${
          cell?.RefElementID || cell?.ElementID
        }`]: decodeBase64(cell?.TextValue),
      };

    case cellTypes.date:
      const dateArray = cell?.DateValue?.slice(0, 10).split('/');
      const date = [dateArray[2], dateArray[0], dateArray[1]]?.join('/');
      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          date,
          cell,
        },
      };

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

      // console.log(
      //   { cell, checkboxOptions, checkboxValue, checkboxDefaults },
      //   'Checkbox'
      // );
      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: {
          options: checkboxOptions,
          defaultValues: checkboxDefaults,
          cell,
        },
      };

    default:
      return {};
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
