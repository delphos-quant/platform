import React, { useState } from 'react';
import styles from './Table.module.scss'; // Import the SCSS module

const ROWS_PER_PAGE = 10;

export const Table = ({ data, columns, index, index_name }: { data: any, columns: any, index: any, index_name: any }) => {
    const [visibleRows, setVisibleRows] = useState(ROWS_PER_PAGE);

    const handleShowMore = () => {
        setVisibleRows(prev => Math.min(prev + ROWS_PER_PAGE, index.length));
    };

    const handleShowLess = () => {
        setVisibleRows(prev => Math.max(prev - ROWS_PER_PAGE, ROWS_PER_PAGE));
    };

    const [sortColumn, setSortColumn] = useState<any>(null);

    // Use sort config to sort the data

    React.useMemo(() => {
        if (sortColumn !== null) {
            // Sort data by the column
            data.sort((a: any, b: any) => {
                if (a[sortColumn] < b[sortColumn]) {
                    return -1;
                }
                if (a[sortColumn] > b[sortColumn]) {
                    return 1;
                }
                return 0;
            });
        } else {
            // Reset the data
            data.sort((a: any, b: any) => a.index - b.index);
        }
    }, [data, sortColumn]);

    return (
        <div className={styles['table-container']}>
            <table className={styles['table']}>
                <thead>
                    <tr>
                        <th onClick={() => setSortColumn(null)} className={styles['table-header']}>{index_name}</th>
                        {columns.map((column: any, i: any) => (
                            <th
                                key={i}
                                onClick={() => setSortColumn(i)}
                                className={styles['table-header']}
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {index.slice(0, visibleRows).map((row: any, i: any) => (
                        <tr key={row}>
                            <td>{row}</td>
                            {columns.map((_: any, j: any) => (
                                <td key={j}>{data[i][j]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {index.length > ROWS_PER_PAGE && (
                <div>
                    {visibleRows < index.length && (
                        <button className={styles['button']} onClick={handleShowMore}>Show More</button>
                    )}
                    {visibleRows > ROWS_PER_PAGE && (
                        <button className={styles['button']} onClick={handleShowLess}>Show Less</button>
                    )}
                </div>
            )}
        </div>
    );
};
