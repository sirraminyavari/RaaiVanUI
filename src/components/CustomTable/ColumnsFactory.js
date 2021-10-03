import {
  DateCell,
  InputCell,
  SelectCell,
  RecordInfoCell,
  FileCell,
  NodeCell,
  UserCell,
} from './cellTypes';
import { cellTypes } from './tableUtils';
import DragIcon from 'components/Icons/DragIcon/Drag';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import RowActions from './RowAction';
import EditRowMenu from './EditRowMenu';
import * as Styled from './CustomTable.styles';

const { RV_Float, RV_RevFloat } = window;

//! Provide cell for a given column.
const provideCell = (header) => {
  switch (header.dataType) {
    case 'action':
      return {
        sticky: 'left',
        Cell: (cell) => {
          if (cell?.editableRowIndex === cell?.row?.index) {
            return <EditRowMenu cell={cell} />;
          }
          return (
            <ToolTip
              tipId={`row-${cell?.row?.index}-action-tip`}
              multiline
              effect="solid"
              event="click"
              place={RV_RevFloat}
              type="dark"
              disable={!cell?.editable}
              clickable
              offset={{ [RV_Float]: -27 }}
              arrowColor="transparent"
              className="table-row-action-tooltip"
              renderContent={() => <RowActions cell={cell} />}>
              <Styled.RowDragHandleWrapper {...cell.dragHandleProps}>
                <DragIcon />
              </Styled.RowDragHandleWrapper>
            </ToolTip>
          );
        },
      };
    case 'index':
      return {
        sticky: 'left',
        Cell: (cell) => (
          <Styled.TableRowIndex>{cell?.row.index + 1}</Styled.TableRowIndex>
        ),
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

    case cellTypes.binary:
      return {
        Footer: (row) => <SelectCell {...row} header={header} isNew />,
      };

    case cellTypes.date:
      return {
        Footer: (footer) => <DateCell {...footer} header={header} isNew />,
      };

    case cellTypes.file:
      return {
        Footer: (footer) => <FileCell {...footer} header={header} isNew />,
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
    // width: getColumnWidth(data, header),
    minWidth: getColumnWidth(data, header),
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
      return Math.min(maxWidth, cellLength * magicSpacing + 60);

    case cellTypes.multiSelect:
      maxWidth = 500;
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
