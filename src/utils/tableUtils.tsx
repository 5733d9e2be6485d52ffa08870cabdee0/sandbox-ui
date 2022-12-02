import React from "react";
import {
  IRowData,
  Td as TableTd,
  Th as TableTh,
} from "@patternfly/react-table";

export interface TableColumn {
  /** Column identifier */
  accessor: string;
  /** Displayed label */
  label: string;
  /** Custom function to be used to render differently all values on this column */
  formatter?: (value: unknown, row?: IRowData) => string | IRowData;
}

export const renderHeader = ({
  column,
  Th,
}: {
  column: TableColumn;
  Th: typeof TableTh;
}): JSX.Element => <Th key={column.accessor}>{column.label}</Th>;

export const renderCell = ({
  column,
  row,
  colIndex,
  Td,
}: {
  column: TableColumn;
  row: IRowData;
  colIndex: number;
  Td: typeof TableTd;
}): JSX.Element => {
  const accessor = column.accessor;
  const formatter: (value: unknown, row?: IRowData) => string | IRowData =
    column.formatter ?? ((value: unknown): IRowData => value as IRowData);
  const objectRowElement = row[accessor] as unknown;
  return (
    <Td key={colIndex} dataLabel={column.label}>
      {formatter(objectRowElement, row)}
    </Td>
  );
};
