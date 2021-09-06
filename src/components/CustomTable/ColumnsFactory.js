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

    case cellTypes.binary:
      return {
        Cell: (row) => <SelectCell {...row} header={header} binary />,
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

    case cellTypes.multiSelect:
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
  return {
    width: getColumnWidth(data, header),
    ...header?.options,
  };
};

const getColumnWidth = (data, header) => {
  // console.log(header, data);
  let maxWidth = header?.options?.maxWidth || 300;
  let magicSpacing;
  let cellLength;

  switch (header.dataType) {
    case cellTypes.string:
      magicSpacing = 15;
      cellLength = Math.max(
        ...data.map((row) => `${row?.[header?.accessor]}`.length),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing);

    case cellTypes.singleSelect:
      // console.log(data, header);
      magicSpacing = header?.options?.editable ? 7 : 5;
      cellLength = Math.max(
        ...(data?.[0]?.[header?.accessor]?.options?.map(
          (option) => option?.label?.length
        ) || []),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing);

    case cellTypes.multiSelect:
      maxWidth = 1000;
      magicSpacing = header?.options?.editable ? 7.8 : 5.5;
      cellLength = Math.max(
        ...(data?.[0]?.[header?.accessor]?.options?.map(
          (option) => option?.label?.length
        ) || []),
        header?.title.length
      );
      const defaultValuesFactor =
        data?.[0]?.[header?.accessor]?.defaultValues?.length > 1 ? 2 : 1;

      return Math.min(
        maxWidth,
        cellLength * defaultValuesFactor * magicSpacing
      );

    case cellTypes.binary:
      magicSpacing = header?.options?.editable ? 7.7 : 6;
      cellLength = Math.max(
        ...(data?.[0]?.[header?.accessor]?.options?.map(
          (option) => option?.label?.length
        ) || []),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing);

    default:
      return header?.options?.width;
  }
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
