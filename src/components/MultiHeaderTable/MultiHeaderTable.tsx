import React from 'react';
import {useTable, useSortBy, Column, Row} from 'react-table';

import styles from './MultiHeaderTable.module.scss';

const topColumns = ["Close", "Open", "High", "Low", "Volume", "VWAP", "NumTrades"];

interface TableData {
    date: string;

    [key: string]: any;
}

interface MultiHeaderTableProps {
    data: {
        [key: string]: {
            [key: string]: number[];
        };
    };
    index: string[];
    secondLevelColumns: string[];
}

export const MultiHeaderTable: React.FC<MultiHeaderTableProps> = ({data, index, secondLevelColumns}) => {
    // Define the column structure with typings
    const columns: Column<TableData>[] = React.useMemo(() => {
        return topColumns.map((header) => ({
            Header: header,
            columns: secondLevelColumns.map((subHeader) => ({
                Header: subHeader,
                accessor: `${header}.${subHeader}`,
            })),
        }));
    }, [secondLevelColumns]);

    // Prepare the rows data structure for react-table
    const tableData: TableData[] = React.useMemo(() => {
        return index.map((date, idx) => {
            const row: TableData = {date};
            topColumns.forEach((topColumn) => {

                row[topColumn] = {};

                secondLevelColumns.forEach((subColumn) => {
                    if (!data[topColumn][subColumn]) {
                        row[topColumn][subColumn] = "-";
                    } else {
                        row[topColumn][subColumn] = data[topColumn][subColumn][idx];
                    }
                });
            });
            return row;
        });
    }, [data, index, secondLevelColumns]);

    // Use the useTable hook to create the table instance with typings
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<TableData>(
        {columns, data: tableData},
        useSortBy
    );

    return (
        <div className={styles.tableContainer}>
            <table {...getTableProps()} className={styles.table}>
                <thead>
                {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {i === 0 ? <th>Date</th> : <th></th>}
                        {headerGroup.headers.map((column: any) =>
                            i === 0 ? ( // Apply sorting only to the first row (top-level headers)
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Sort direction indicator */}
                                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                </th>
                            ) : (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            )
                        )}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row: Row<TableData>) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            <td>{row.original.date}</td>
                            {/* Date column data */}
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};
