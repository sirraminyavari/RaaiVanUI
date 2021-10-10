import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from './TableCell.styles';

const TableCell = (props) => {
  const { tableInfo } = props?.value || {};
  // console.log(tableInfo, props, 'table');

  const handleOnTableClick = () => {
    props?.setModal({
      show: true,
      title: decodeBase64(tableInfo?.FormName),
      type: 'table',
    });
  };

  return (
    <Styled.TableCellContainer>
      <TableIcon onClick={handleOnTableClick} size={22} color={CV_GRAY} />
    </Styled.TableCellContainer>
  );
};

export default TableCell;
