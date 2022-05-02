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

export interface TableRow extends IRowData {
  /** Additive property which stores the entire object row data */
  originalData?: IRowData;
}

interface TableProps {
  /** It enables the presence of an action menu on the rows, with the given resolver */
  actionResolver?: (rowData?: IRow) => IAction[];
  /** Accessible name for the table */
  ariaLabel?: string;
  /** Columns to display */
  columns: TableColumn[];
  /** List of additive css classes */
  cssClasses?: string | string[];
  /** Collection of cells to render */
  rows: TableRow[];
  /** Style variant for the table */
  variant?: "compact";
  /** Element to be rendered when there are no rows to display */
  children?: JSX.Element;
}

export const Table: FunctionComponent<TableProps> = ({
  actionResolver,
  ariaLabel = "Table",
  columns,
  cssClasses,
  rows,
  variant,
  children,
}) => {
  const transformColumns = (columns: TableColumn[]): string[] => {
    return columns.map((column) => column.label);
  };

  const transformRows = (
    rows: IRowData[],
    columns: TableColumn[]
  ): { cells: (string | IRowData)[]; originalData: IRowData }[] => {
    return rows.map((objectRow) => {
      return {
        cells: columns.map((column) => {
          const accessor = column.accessor;
          const formatter =
            column.formatter ?? ((value: IRowData): IRowData => value);
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
      ouiaId={ariaLabel}
    >
      <Thead>
        <Tr ouiaId="table-head">
          {transformColumns(columns).map((column) => (
            <Th key={column}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      {!rows.length && children ? (
        <Tbody>
          <Tr ouiaId="no-data">
            <Td colSpan={columns.length}>{children}</Td>
          </Tr>
        </Tbody>
      ) : (
        <Tbody>
          {transformRows(rows, columns).map((row: TableRow, rowIndex) => (
            <Tr
              ouiaId={row.originalData?.id as string}
              key={(row.originalData?.id as string) ?? rowIndex}
            >
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
      )}
    </TableComposable>
  );
};
