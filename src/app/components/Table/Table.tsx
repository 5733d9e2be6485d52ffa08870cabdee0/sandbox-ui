import React, { FunctionComponent } from 'react';
import {
  HeaderProps,
  IActionsResolver,
  IRow,
  IRowData,
  Table as PFTable,
  TableBody,
  TableBodyProps,
  TableHeader,
} from '@patternfly/react-table';
import { css } from '@patternfly/react-styles';

interface TableColumn {
  /** Column identifier */
  accessor: string;
  /** Displayed label */
  label: string;
  /** Custom function to be used to render differently all values on this column */
  formatter?: (value: IRowData, row?: IRow) => string | IRowData;
}

interface TableProps {
  /** It enables the presence of an action menu on the rows, with the given resolver */
  actionResolver?: IActionsResolver;
  /** Accessible name for the table */
  ariaLabel?: string;
  /** Element to be appended after the `tbody` node */
  children?: React.ReactNode;
  /** Columns to display */
  columns: TableColumn[];
  /** list of additive css classes */
  cssClasses?: string | string[];
  /** Collection of cells to render */
  rows: IRow[];
  /** Additive table body props */
  tableBodyProps?: Omit<TableBodyProps, 'children'>;
  /** Additive table header props */
  tableHeaderProps?: Omit<HeaderProps, 'children'>;
  /** Style variant for the table */
  variant?: 'compact' | undefined;
}

export const Table: FunctionComponent<TableProps> = ({
  actionResolver,
  ariaLabel = 'Table',
  children,
  columns,
  cssClasses,
  rows,
  tableBodyProps,
  tableHeaderProps,
  variant = 'compact',
}) => {
  const transformColumns = (columns: TableColumn[]) => {
    return columns.map((column) => column.label);
  };

  const transformRows = (rows: IRowData[], columns: TableColumn[]) => {
    return rows.map((objectRow) => {
      return {
        cells: columns.map((column) => {
          const accessor = column.accessor;
          const formatter = column.formatter ?? ((value: IRowData) => value);
          return formatter(objectRow[accessor], objectRow);
        }),
        originalData: objectRow,
      };
    });
  };

  return (
    <PFTable
      className={css(cssClasses)}
      cells={transformColumns(columns)}
      variant={variant}
      rows={transformRows(rows, columns)}
      aria-label={ariaLabel}
      actionResolver={actionResolver}
    >
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
      {children}
    </PFTable>
  );
};
