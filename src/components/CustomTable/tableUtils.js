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
  const normalizedCell = Object.assign({}, cell, {
    Info: toJSON(decodeBase64(cell.Info) || '{}'),
    Title: decodeBase64(cell.Title),
    Name: decodeBase64(cell.Name),
    Help: decodeBase64(cell.Help).trim(),
    TextValue: decodeBase64(cell.TextValue),
  });

  return {
    [`${cell?.Type}_${cell?.RefElementID || cell?.ElementID}`]: normalizedCell,
  };
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
    ?.filter((col) => col?.Type !== cellTypes.separator)
    ?.map((col) => ({
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
    });
  });
};
