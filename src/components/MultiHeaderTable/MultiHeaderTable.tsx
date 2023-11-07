import React from "react";
import {CSVLink} from 'react-csv';
import {useSortBy, useTable} from "react-table";

import styles from './MultiHeaderTable.module.scss';

// Define table props
interface MultiHeaderTableProps {
    columns: any[];
    data: any[];
    onSelect: (selectedRows: any[]) => void;
}

export const MultiHeaderTable: React.FC<MultiHeaderTableProps> = ({columns, data, onSelect}) => {
    const [selectedRows, setSelectedRows] = React.useState(new Set());

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy // This plugin hook enables sorting
    );

    const handleSelectRow = (rowId: any) => {
        const newSelectedRows: any = new Set(selectedRows);
        if (newSelectedRows.has(rowId)) {
            newSelectedRows.delete(rowId);
        } else {
            newSelectedRows.add(rowId);
        }
        setSelectedRows(newSelectedRows);
        onSelect([...newSelectedRows]);
    };

    return (
        <div className={styles.tableContainer}>
            <CSVLink
                className={styles.exportButton}
                data={selectedRows.size > 0 ? rows.filter(row => selectedRows.has(row.id)).map(row => row.original) : data}
                filename="export.csv" // You can specify a filename here
            >
                Export to CSV
            </CSVLink>
            <table {...getTableProps()} className={styles.table}>

                <thead>
                {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} className={styles.headerGroup}>
                        {headerGroup.headers.map((column: any) => (
                            <th
                                {...column.getHeaderProps(index % 2 === 1 ? column.getSortByToggleProps() : {})} // Apply sorting props to every second header row
                                colSpan={column.columns ? column.columns.length : 1}
                            >
                                {column.render('Header')}
                                {index % 2 === 1 && (
                                    column.isSorted
                                        ? column.isSortedDesc
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    const isSelected = selectedRows.has(row.id);
                    return (
                        <tr
                            {...row.getRowProps()}
                            className={isSelected ? styles.selectedRow : ''} // Apply selected row style conditionally
                            onClick={() => handleSelectRow(row.id)} // Attach the click event to handle row selection
                        >
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()} className={styles.cell}>
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

    );
};