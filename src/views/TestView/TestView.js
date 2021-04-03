import { useMemo } from 'react';
import styled from 'styled-components';
import CustomTable from 'components/CustomTable/CustomTable';
import makeData from './makeData';

const Styles = styled.div`
  padding: 1rem;

  table {
    direction: ltr;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      text-align: center;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const TestView = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Info',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  );

  const data = useMemo(() => makeData(10), []);

  return (
    <Styles>
      <CustomTable columns={columns} data={data} />
    </Styles>
  );
};

export default TestView;
