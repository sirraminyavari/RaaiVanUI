import {
  DateCell,
  TextCell,
  SelectCell,
  RecordInfoCell,
  FileCell,
  NodeCell,
  UserCell,
  TableCell,
  MultiLevelCell,
  BinaryCell,
  ActionsCell,
  NumberCell,
} from './cellTypes';
import { cellTypes } from './tableUtils';
import * as Styled from './CustomTable.styles';

//! Provide cell for a given column.
const provideCell = (header) => {
  switch (header.dataType) {
    case cellTypes.action:
      return {
        sticky: 'left',
        Cell: (cell) => <ActionsCell cell={cell} />,
      };
    case cellTypes.index:
      return {
        sticky: 'left',
        Cell: (cell) => (
          <Styled.TableRowIndex type="h4">
            {cell?.row.index + 1}
          </Styled.TableRowIndex>
        ),
      };

    case cellTypes.text:
      return {
        Cell: (row) => <TextCell {...row} header={header} />,
      };

    case cellTypes.number:
      return {
        Cell: (row) => <NumberCell {...row} header={header} />,
      };

    case cellTypes.date:
      return {
        Cell: (row) => <DateCell {...row} header={header} />,
      };

    case cellTypes.singleSelect:
      return {
        Cell: (row) => <SelectCell {...row} header={header} />,
      };

    case cellTypes.multiSelect:
      return {
        Cell: (row) => <SelectCell {...row} header={header} multiSelect />,
      };

    case cellTypes.binary:
      return {
        Cell: (row) => <BinaryCell {...row} header={header} />,
      };

    case cellTypes.recordInfo:
      return {
        Cell: (row) => <RecordInfoCell {...row} header={header} />,
      };

    case cellTypes.file:
      return {
        Cell: (row) => <FileCell {...row} header={header} />,
      };

    case cellTypes.node:
      return {
        Cell: (row) => <NodeCell {...row} header={header} />,
      };

    case cellTypes.user:
      return {
        Cell: (row) => <UserCell {...row} header={header} />,
      };

    case cellTypes.table:
      return {
        Cell: (row) => <TableCell {...row} header={header} />,
      };

    case cellTypes.multiLevel:
      return {
        Cell: (row) => <MultiLevelCell {...row} header={header} />,
      };

    default:
      return {};
  }
};

//! Provide options for a given column.
const provideOptions = (header, data) => {
  return {
    width: getColumnWidth(data, header),
    // minWidth: getColumnWidth(data, header),
    ...header?.options,
  };
};

const getColumnWidth = (data, header) => {
  // console.log(header, data);
  let maxWidth = header?.options?.maxWidth || 300;
  let magicSpacing;
  let cellLength;

  switch (header.dataType) {
    case cellTypes.text:
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
      return Math.min(maxWidth, cellLength * magicSpacing + 60);

    case cellTypes.multiSelect:
      maxWidth = 500;
      magicSpacing = header?.options?.editable ? 17 : 5.5;
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
        cellLength * defaultValuesFactor * magicSpacing + 60
      );

    case cellTypes.binary:
      magicSpacing = header?.options?.editable ? 7.7 : 6;
      cellLength = Math.max(
        ...(data?.[0]?.[header?.accessor]?.options?.map(
          (option) => option?.label?.length
        ) || []),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing + 55);

    case cellTypes.file:
      magicSpacing = 12;
      cellLength = Math.max(
        ...data?.map((row) => row?.[header?.accessor]?.fileTitle?.length),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing);

    case cellTypes.node:
      magicSpacing = 12;
      cellLength = Math.max(
        ...data?.map((row) => row?.[header?.accessor]?.fileTitle?.length),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing);

    case cellTypes.user:
      magicSpacing = 12;
      cellLength = Math.max(
        ...data?.map((row) => row?.[header?.accessor]?.fileTitle?.length),
        header?.title.length
      );
      return Math.min(maxWidth, cellLength * magicSpacing);

    default:
      return header?.options?.width;
  }
};

//! Column factory.
const makeColumns = (headers, data) => {
  const dataColumns = headers.map((header) => {
    return {
      Header: header.title,
      accessor: header.accessor,
      ...provideCell(header),
      ...provideOptions(header, data),
    };
  });

  return dataColumns;
};

export default makeColumns;
