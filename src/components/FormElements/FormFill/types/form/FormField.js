import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { toJSON } from 'helpers/helpers';
import Table from './Table';
import useWindow from 'hooks/useWindowContext';
import styled from 'styled-components';

const FormField = (props) => {
  const {
    tableColumns,
    tableData,
    decodeInfo,
    decodeTitle,
    ElementID,
    InstanceID,
    RefElementID,
    SequenceNumber,
    type,
    ...rest
  } = props;
  const { FormID } = toJSON(decodeInfo);
  const { RVDic } = useWindow();

  const renderTable = () => {
    return (
      <>
        {tableColumns ? (
          <Table
            ElementID={ElementID}
            InstanceID={InstanceID}
            RefElementID={RefElementID}
            SequenceNumber={SequenceNumber}
            tableColumns={tableColumns}
            tableData={tableData}
            tableOwnerId={ElementID}
            FormID={FormID}
            title={decodeTitle}
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
      iconComponent={<TableIcon size={'1.22rem'} color={CV_GRAY} />}
      title={decodeTitle}
      {...rest}
    >
      <TableWrapper>{renderTable()}</TableWrapper>
    </FormCell>
  );
};

export default FormField;

export const TableWrapper = styled.div`
  width: calc(100% - 2rem);
  min-width: 20rem;
`;
