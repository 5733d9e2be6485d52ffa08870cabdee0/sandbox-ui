import React, { FunctionComponent, useCallback } from "react";
import {
  Card,
  PaginationVariant,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { Pagination } from "@app/components/Pagination/Pagination";
import { TableSkeleton } from "@app/components/TableSkeleton/TableSkeleton";
import {
  RenderActionsCb,
  ResponsiveTable,
} from "@rhoas/app-services-ui-components";
import { IRowData } from "@patternfly/react-table";

export interface TableColumn {
  /** Column identifier */
  accessor: string;
  /** Displayed label */
  label: string;
  /** Custom function to be used to render differently all values on this column */
  formatter?: (value: unknown, row?: IRowData) => string | IRowData;
}

interface TableWithPaginationProps {
  /** List of columns for the table */
  columns: TableColumn[];
  /** List of rows for the table */
  rows: IRowData[];
  /** The total number of rows for the table */
  totalRows: number;
  /** The current page number (0-based) */
  pageNumber: number;
  /** The page size */
  pageSize: number;
  /** Called when pagination params are changed by the user */
  onPaginationChange: (pageNumber: number, pageSize: number) => void;
  /** Table label */
  tableLabel: string;
  /** Custom element you want to be in the toolbar */
  customToolbarElement?: React.ReactNode;
  /** True, when table data is loading */
  isLoading?: boolean;
  /** Element to be rendered when there are no rows to display */
  children?: JSX.Element;
  /** Render function to add actions to the table */
  renderActions?: RenderActionsCb<IRowData>;
  getRowOuiaId: (row: IRowData) => string | undefined;
}

export const FIRST_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 10;

/**
 * The goal of this component is to provide a reusable template composed by:
 * - Toolbar (with top-pagination)
 * - Table
 * - bottom-pagination
 */
export const TableWithPagination: FunctionComponent<
  TableWithPaginationProps
> = ({
  columns,
  customToolbarElement,
  isLoading,
  rows,
  totalRows,
  pageNumber,
  pageSize,
  onPaginationChange,
  tableLabel,
  children,
  renderActions,
  getRowOuiaId,
}) => {
  const getPagination = (isBottom: boolean): JSX.Element => (
    <Pagination
      itemCount={totalRows}
      page={pageNumber + 1}
      perPage={pageSize}
      isCompact={!isBottom}
      {...(isBottom ? { variant: PaginationVariant.bottom } : {})}
      onChange={(page, perPage): void => onPaginationChange(page - 1, perPage)}
      ouiaId={!isBottom ? "rows-top" : "rows-bottom"}
    />
  );

  /* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
  const rowOuiaId = useCallback(
    ({ row, rowIndex }): string =>
      getRowOuiaId(row as IRowData) ?? `table-row-${String(rowIndex)}`,
    [getRowOuiaId]
  );

  const renderHeader = useCallback(
    ({ column, Th }): JSX.Element => (
      <Th key={column.accessor}>{column.label}</Th>
    ),
    []
  );

  const renderCell = useCallback(
    ({ column, row, colIndex, Td }): JSX.Element => {
      const accessor = column.accessor;
      const formatter: (value: unknown, row?: IRowData) => string | IRowData =
        column.formatter ?? ((value: IRowData): IRowData => value);
      const objectRowElement = row[accessor] as unknown;
      return (
        <Td key={colIndex} dataLabel={column.label}>
          {formatter(objectRowElement, row as IRowData)}
        </Td>
      );
    },
    []
  );

  const setRowKey = useCallback(({ row }) => row.id as string, []);
  /* eslint-enable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

  return (
    <Card ouiaId={tableLabel}>
      <Toolbar ouiaId="rows-toolbar">
        <ToolbarContent>
          <ToolbarItem
            className="overview__toolbar-custom"
            alignment={{ default: "alignLeft" }}
          >
            {customToolbarElement}
          </ToolbarItem>
          <ToolbarItem
            variant="pagination"
            alignment={{ default: "alignRight" }}
          >
            {getPagination(false)}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      {isLoading ? (
        <TableSkeleton
          columns={columns}
          totalRows={pageSize}
          hasActionColumn={true}
        />
      ) : (
        <ResponsiveTable
          ariaLabel={tableLabel}
          columns={columns}
          data={rows}
          renderActions={renderActions}
          renderHeader={renderHeader}
          renderCell={renderCell}
          setRowOuiaId={rowOuiaId}
          setRowKey={setRowKey}
          tableOuiaId={tableLabel}
        >
          {children}
        </ResponsiveTable>
      )}
      {getPagination(true)}
    </Card>
  );
};
