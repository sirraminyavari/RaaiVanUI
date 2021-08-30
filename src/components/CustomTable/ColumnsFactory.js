import { DateCell, InputCell } from './types';

//! Provide cell for a given column.
const provideCell = (header) => {
  switch (header.dataType) {
    case 'index':
      return {
        Cell: ({ row }) => {
          return row.index + 1;
        },
      };

    case 'string':
      return { Cell: (row) => <InputCell {...row} header={header} /> };

    case 'number':
      return { Cell: (row) => <InputCell {...row} header={header} /> };

    case 'date':
      return { Cell: DateCell };

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
const provideOptions = (header) => {
  switch (header.dataType) {
    case 'index':
      return {
        width: 40,
        maxWidth: 40,
        disableSortBy: !!header?.options?.disableSort,
      };
    case 'string':
      return { disableSortBy: !!header?.options?.disableSort };
    case 'number':
      return { disableSortBy: !!header?.options?.disableSort };

    case 'date':
      return { disableSortBy: !!header?.options?.disableSort };

    default:
      return {};
  }
};

//! Column factory.
const makeColumns = (headers) => {
  const dataCulomns = headers.map((header) => {
    return {
      Header: header.title,
      accessor: header.accessor,
      ...provideFooter(header),
      ...provideCell(header),
      ...provideOptions(header),
    };
  });

  return dataCulomns;
};

export default makeColumns;
