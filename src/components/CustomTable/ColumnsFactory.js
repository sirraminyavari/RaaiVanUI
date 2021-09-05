import { DateCell, InputCell, SelectCell, RecordInfoCell } from './types';
import { cellTypes } from './tableUtils';
import DragIcon from 'components/Icons/DragIcon/Drag';
// import * as Styled from './CustomTable.styles';

//! Provide cell for a given column.
const provideCell = (header) => {
  switch (header.dataType) {
    case 'action':
      return {
        Cell: (cell) => {
          return (
            <div style={{ cursor: 'pointer' }} {...cell.dragHandleProps}>
              <DragIcon />
            </div>
          );
        },
      };
    case 'index':
      return {
        Cell: (cell) => {
          return <span>{cell?.row.index + 1}</span>;
        },
      };

    case cellTypes.string:
      return { Cell: (row) => <InputCell {...row} header={header} /> };

    case cellTypes.number:
      return { Cell: (row) => <InputCell {...row} header={header} /> };

    case cellTypes.date:
      return { Cell: (row) => <DateCell {...row} header={header} /> };

    case cellTypes.singleSelect:
      return { Cell: (row) => <SelectCell {...row} header={header} /> };

    case cellTypes.multiSelect:
      return {
        Cell: (row) => <SelectCell {...row} header={header} multiSelect />,
      };

    case cellTypes.recordInfo:
      return {
        Cell: (row) => <RecordInfoCell {...row} header={header} />,
      };

    default:
      return;
  }
};

//! Provide footer for a given column.
const provideFooter = (header) => {
  switch (header.dataType) {
    case cellTypes.string:
      return {
        Footer: (footer) => <InputCell {...footer} header={header} isNew />,
      };
    case cellTypes.number:
      return {
        Footer: (footer) => <InputCell {...footer} header={header} isNew />,
      };

    case cellTypes.singleSelect:
      return {
        Footer: (row) => <SelectCell {...row} header={header} isNew />,
      };

    case cellTypes.date:
      return {
        Footer: (footer) => <DateCell {...footer} header={header} isNew />,
      };

    default:
      return {
        Footer: header.title,
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

  const maxWidth = header?.options?.maxWidth || 300;
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
