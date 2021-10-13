import { decodeBase64, toJSON } from 'helpers/helpers';

const { GlobalUtilities } = window;

export const cellTypes = {
  action: 'Action',
  index: 'Index',
  text: 'Text',
  number: 'Numeric',
  date: 'Date',
  singleSelect: 'Select',
  multiSelect: 'Checkbox',
  binary: 'Binary',
  recordInfo: 'RecordInfo',
  file: 'File',
  node: 'Node',
  user: 'User',
  multiLevel: 'MultiLevel',
  table: 'Form',
  separator: 'Separator', //! Not used in table.
};

export const modalTypes = {
  table: 'Form',
};

export const prepareCell = (cell) => {
  switch (cell?.Type) {
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
        ? checkboxValue
            .split('~')
            .map((value) => ({ value: value.trim(), label: value.trim() }))
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

    default:
      return {
        [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: cell,
      };
  }
};

export const prepareHeaders = (columns, getColumnOptions) => [
  {
    id: 'action',
    title: '',
    accessor: 'rowAction',
    dataType: cellTypes.action,
    options: getColumnOptions({ Type: cellTypes.action }),
  },
  {
    id: 'index',
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
      options: {
        editable: true,
        isRequired: !!col?.IsRequired,
        ...getColumnOptions(col),
      },
    })),
];

export const prepareRows = (data, columns) => {
  return data?.map((row) => {
    const cells = columns
      ?.filter((col) => col?.Type !== cellTypes.separator)
      ?.map((col) => {
        const arr = row?.Elements?.filter(
          (e) =>
            e?.ElementID === col?.ElementID ||
            e?.RefElementID === col?.ElementID
        );
        return arr?.length ? arr[0] : GlobalUtilities.extend({}, col);
      });

    return cells.reduce((acc, cell) => ({ ...acc, ...prepareCell(cell) }), {
      id: row?.InstanceID,
      recordInfo: { cell: cells[0] },
    });
  });
};
