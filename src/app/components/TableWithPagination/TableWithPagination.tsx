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

interface TableWithPaginationProps {
  /** List of columns for the table */
  columns: TableColumn[];
  /** List of rows for the table */
  rows: TableRow[];
  /** Table label */
  tableLabel: string;
  /** Custom element you want to be in the toolbar */
  customToolbarElement?: React.ReactNode;
}

/**
 * The goal of this component is to provide a reusable template composed by:
 * - Toolbar (with top-pagination)
 * - Table
 * - bottom-pagination
 */
export const TableWithPagination: FunctionComponent<
  TableWithPaginationProps
> = ({ columns, customToolbarElement, rows, tableLabel }) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const actionResolver = (): { title: string; onClick: () => void }[] => {
    return [
      {
        title: t("common.details"),
        onClick: (): void =>
          // @TODO missing action to perform when clicking on details action
          {},
      },
      {
        title: t("common.delete"),
        onClick: (): void =>
          // @TODO missing action to perform when clicking on delete action
          {},
      },
    ];
  };

  const getPagination = (itemCount: number, isBottom: boolean): JSX.Element => (
    <Pagination
      itemCount={itemCount}
      page={1}
      perPage={20}
      isCompact={!isBottom}
      {...(isBottom ? { variant: PaginationVariant.bottom } : {})}
      onChange={(): void =>
        // @TODO missing action when changing the page
        {}
      }
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
            {getPagination(rows.length, false)}
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
      {getPagination(rows.length, true)}
    </Card>
  );
};
