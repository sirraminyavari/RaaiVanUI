import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { toJSON } from 'helpers/helpers';
import Table from './Table';
import * as Styled from './FormField.styles';
import useWindow from 'hooks/useWindowContext';

const FormField = (props) => {
  const {
    tableColumns,
    tableData,
    decodeInfo,
    decodeTitle,
    elementId,
    type,
    ...rest
  } = props;
  const { FormID: tableId } = toJSON(decodeInfo);
  const { RVDic } = useWindow();

  const renderTable = () => {
    return (
      <>
        {tableColumns ? (
          <Table
            tableColumns={tableColumns}
            tableData={tableData}
            tableOwnerId={elementId}
            tableId={tableId}
            editByCell={true}
          />
        ) : (
          <div>{RVDic.NothingToDisplay}</div>
        )}
      </>
    );
  };

  return (
    <FormCell
      iconComponent={<TableIcon size={15} color={CV_GRAY} />}
      title={decodeTitle}
      {...rest}>
      <Styled.TableWrapper>{renderTable()}</Styled.TableWrapper>
    </FormCell>
  );
};

export default FormField;
