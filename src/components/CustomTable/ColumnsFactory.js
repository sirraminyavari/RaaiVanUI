import { DateCell, InputCell, SingleSelectCell } from './types';
import { cellTypes } from './tableUtils';

//! Provide cell for a given column.
const provideCell = (header) => {
  switch (header.dataType) {
    case 'index':
      return {
        Cell: ({ row }) => {
          return row.index + 1;
        },
      };

    case cellTypes.string:
      return { Cell: (row) => <InputCell {...row} header={header} /> };

    case cellTypes.number:
      return { Cell: (row) => <InputCell {...row} header={header} /> };

    case cellTypes.date:
      return { Cell: (row) => <DateCell {...row} header={header} /> };

    case cellTypes.singleSelect:
      return { Cell: (row) => <SingleSelectCell {...row} header={header} /> };

    default:
      return;
  }
};

//! Provide footer for a given column.
const provideFooter = (header) => {
  switch (header.dataType) {
    case 'string':
      return { Footer: (footer) => <InputCell {...footer} header={header} /> };
    case 'number':
      return { Footer: (footer) => <InputCell {...footer} header={header} /> };

    case 'date':
      return { Footer: DateCell };

    default:
      return {
        Footer: header.dataType,
      };
  }
};

//! Provide options for a given column.
const provideOptions = (header, data) => {
  switch (header.dataType) {
    case cellTypes.index:
      return { ...header?.options };
    case cellTypes.string:
      return {
        width: getColumnWidth(data, header),
        ...header?.options,
      };
    case cellTypes.number:
      return { ...header?.options };
    case cellTypes.singleSelect:
      return { ...header?.options };
    case cellTypes.date:
      return { ...header?.options };

    default:
      return { ...header?.options };
  }
};

const getColumnWidth = (data, header) => {
  // if (typeof accessor === 'string' || accessor instanceof String) {
  //   accessor = (d) => d[accessor];
  // }

  const maxWidth = 300;
  const magicSpacing = 15;
  const cellLength = Math.max(
    ...data.map((row) => `${row?.[header?.accessor]}`.length),
    header?.title.length
  );
  return Math.min(maxWidth, cellLength * magicSpacing);
};

//! Column factory.
const makeColumns = (headers, data) => {
  const dataCulomns = headers.map((header) => {
    return {
      Header: header.title,
      accessor: header.accessor,
      ...provideFooter(header),
      ...provideCell(header),
      ...provideOptions(header, data),
    };
  });

  return dataCulomns;
};

export default makeColumns;
