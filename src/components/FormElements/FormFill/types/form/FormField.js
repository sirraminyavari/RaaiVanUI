import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { toJSON } from 'helpers/helpers';
import Table from './Table';

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

  const renderTable = () => {
    if (tableData && tableData.length > 0) {
      return (
        <Table
          tableColumns={tableColumns}
          tableData={tableData}
          tableOwnerId={elementId}
          tableId={tableId}
          editByCell={true}
        />
      );
    }
    return null;
  };

  return (
    <FormCell
      iconComponent={<TableIcon size={15} color={CV_GRAY} />}
      title={decodeTitle}
      {...rest}>
      <div style={{ width: '50rem' }}>{renderTable()}</div>
    </FormCell>
  );
};

export default FormField;
