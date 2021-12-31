import React from 'react';
import { usePagination, useTable } from 'react-table';
import * as Styled from './MyTbl.stles';
import { useHistory } from 'react-router-dom';

export const MyTable = ({ columns, data }) => {
  const history = useHistory();
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    getHooks,
  } = useTable(
    {
      defaultColumn,
      columns,
      data,
    },
    usePagination
  );
  return (
    <div sx={{ maxHeight: 500 }}>
      <Styled.TableContainer>
        <table {...getTableProps()} stickyHeader>
          <Styled.TableHeader>
            {headerGroups.map((headerGroup) => {
              return (
                <Styled.TableRowHeader {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </Styled.TableRowHeader>
              );
            })}
          </Styled.TableHeader>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Styled.TRow
                  {...row.getRowProps()}
                  striped={true}
                  onClick={() => {
                    console.log('hhh');
                    history.push('/');
                  }}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        style={{
                          padding: '.2rem .1rem',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'center',
                          justifyContent: 'center',
                        }}
                        {...cell.getCellProps()}>
                        {cell.render('Cell')}{' '}
                      </td>
                    );
                  })}
                </Styled.TRow>
              );
            })}
          </tbody>
        </table>
      </Styled.TableContainer>
      {/* <Card sx={{backgroundColor: 'linen', textAlign:'center'}}>
          <Stack spacing={2}>
            <Pagination count={10} color='secondary' variant='text' sx={{textAlign:'center'}} showFirstButton showLastButton />
          </Stack>
          </Card> */}
    </div>
  );
};
