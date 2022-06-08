import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from '@cliqmind/react-table';

//TODO add jsDoc and PropTypes
const ResponsiveTable = ({ data, columns }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIdx) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`row-${rowIdx}`}>
                {row.cells.map((cell, cellIdx) => {
                  return (
                    <td {...cell.getCellProps()}>
                      <div>{cell.render('Cell')}</div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

ResponsiveTable.propTypes = {};

export default ResponsiveTable;
