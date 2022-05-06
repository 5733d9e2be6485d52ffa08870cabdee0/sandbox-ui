import React, { FunctionComponent } from "react";
import {
  Card,
  PaginationVariant,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { Table, TableColumn, TableRow } from "@app/components/Table";
import { Pagination } from "@app/components/Pagination/Pagination";
import { useTranslation } from "react-i18next";
import { IRow } from "@patternfly/react-table";

interface TableWithPaginationProps {
  /** List of columns for the table */
  columns: TableColumn[];
  /** List of rows for the table */
  rows: TableRow[];
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
  /** Function executed when clicking on the "Details" action */
  onDetailsClick?: (rowData?: IRow) => void;
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
  onDetailsClick,
  rows,
  totalRows,
  pageNumber,
  pageSize,
  onPaginationChange,
  tableLabel,
}) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const actionResolver = (
    rowData?: IRow
  ): { title: string; onClick: () => void }[] => {
    return [
      {
        title: t("common.details"),
        onClick: (): void => onDetailsClick?.(rowData),
      },
      {
        title: t("common.delete"),
        onClick: (): void =>
          // @TODO missing action to perform when clicking on delete action
          {},
      },
    ];
  };

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

  return (
    <Card>
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
      <Table
        actionResolver={actionResolver}
        ariaLabel={tableLabel}
        columns={columns}
        cssClasses="overview__table"
        rows={rows}
      />
      {getPagination(true)}
    </Card>
  );
};
