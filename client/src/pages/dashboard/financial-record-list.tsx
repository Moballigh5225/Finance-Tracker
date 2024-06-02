import { useMemo, useState } from 'react';
import { FinancialRecord, useFinancialRecords } from '../../contexts/financial-record-context';
import { useTable, Column, CellProps, Row } from 'react-table';

interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      updateRecord(row.index, column.id, value);
    }
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? 'pointer' : 'default' }}>
      {isEditing ? (
        <input
          value={value || ''}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
          autoFocus
          style={{ width: '100%' }}
        />
      ) : typeof value === 'string' ? (
        value
      ) : (
        value?.toString() // using optional chaining to handle potential undefined value
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]._id;
    updateRecord(id ?? '', { ...records[rowIndex], [columnId]: value });
  };

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: 'Description',
        accessor: 'description',
        Cell: props => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: props => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: props => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
        Cell: props => <EditableCell {...props} updateRecord={updateCellRecord} editable={true} />,
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: props => <EditableCell {...props} updateRecord={updateCellRecord} editable={false} />,
      },
      {
        Header: 'Delete',
        id: 'delete',
        Cell: ({ row }) => (
          <button onClick={() => deleteRecord(row.original._id ?? '')} className="button">
            Delete
          </button>
        ),
      },
    ],
    [records],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: records,
  });

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(hg => {
            const { key, ...headerGroupProps } = hg.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroupProps}>
                {hg.headers.map(column => {
                  const { key, ...headerProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...headerProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            const { key, ...rowProps } = row.getRowProps();
            return (
              <tr key={key} {...rowProps}>
                {row.cells.map(cell => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...cellProps}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
