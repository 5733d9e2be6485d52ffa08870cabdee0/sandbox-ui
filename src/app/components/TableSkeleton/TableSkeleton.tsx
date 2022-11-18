import {
  ActionsColumn,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import React from "react";
import { Skeleton } from "@patternfly/react-core";
import { TableColumn } from "@app/components/TableWithPagination/TableWithPagination";

export interface TableSkeletonProps {
  /** List of columns for the table */
  columns: TableColumn[];
  /** The total number of rows for the table */
  totalRows: number;
  /** True, if table has action column */
  hasActionColumn: boolean;
}

export const TableSkeleton = ({
  columns,
  totalRows,
  hasActionColumn,
}: TableSkeletonProps): JSX.Element => {
  return (
    <TableComposable aria-label="table-skeleton">
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.label}>{column.label}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {[...Array(totalRows).keys()].map((rowNumber) => (
          <Tr key={rowNumber}>
            {columns.map((column, cellIndex) => (
              <Td key={cellIndex}>
                <Skeleton key={column.label} />
              </Td>
            ))}
            {hasActionColumn && (
              <Td className="pf-c-table__action">
                <ActionsColumn />
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};
