import React, { FunctionComponent } from "react";
import {
  ActionsColumn,
  IAction,
  IRow,
  IRowData,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { css } from "@patternfly/react-styles";

export interface TableColumn {
  /** Column identifier */
  accessor: string;
  /** Displayed label */
  label: string;
  /** Custom function to be used to render differently all values on this column */
  formatter?: (value: IRowData, row?: TableRow) => string | IRowData;
}

interface TableRow extends IRowData {
  /** Additive property which stores the entire object row data */
  originalData?: IRowData;
}

interface TableProps {
  /** It enables the presence of an action menu on the rows, with the given resolver */
  actionResolver?: (rowData?: IRow) => IAction[];
  /** Accessible name for the table */
  ariaLabel?: string;
  /** Element to be appended after the `tbody` node */
  children?: React.ReactNode;
  /** Columns to display */
  columns: TableColumn[];
  /** list of additive css classes */
  cssClasses?: string | string[];
  /** Collection of cells to render */
  rows: TableRow[];
  /** Style variant for the table */
  variant?: "compact";
}

export const Table: FunctionComponent<TableProps> = ({
  actionResolver,
  ariaLabel = "Table",
  children,
  columns,
  cssClasses,
  rows,
  variant,
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
          const objectRowElement = objectRow[accessor] as TableRow;
          return formatter(objectRowElement, objectRow);
        }),
        originalData: objectRow,
      };
    });
  };

  return (
    <TableComposable
      className={css(cssClasses)}
      variant={variant}
      aria-label={ariaLabel}
    >
      <Thead>
        <Tr>
          {transformColumns(columns).map((column) => (
            <Th key={column}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {transformRows(rows, columns).map((row: TableRow, rowIndex) => (
          <Tr key={(row.originalData?.id as string) ?? rowIndex}>
            {row?.cells?.map((cell, cellIndex) => (
              <Td key={cellIndex}>{cell}</Td>
            ))}
            {actionResolver && (
              <Td className="pf-c-table__action">
                <ActionsColumn items={actionResolver(row?.originalData)} />
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
      {children}
    </TableComposable>
  );
};
