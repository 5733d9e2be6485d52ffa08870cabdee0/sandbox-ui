import {
  Card,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import React from "react";
import {
  TableSkeleton,
  TableSkeletonProps,
} from "@app/components/TableSkeleton/TableSkeleton";

interface TableWithPaginationSkeletonProps {
  /** Custom element you want to be in the toolbar */
  customToolbarElement?: React.ReactNode;
}

export const TableWithPaginationSkeleton = (
  props: TableSkeletonProps & TableWithPaginationSkeletonProps
): JSX.Element => {
  return (
    <Card ouiaId="loading-table">
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem alignment={{ default: "alignLeft" }}>
            {props.customToolbarElement}
          </ToolbarItem>
          <ToolbarItem
            variant="pagination"
            alignment={{ default: "alignRight" }}
          >
            <Skeleton width={"190px"} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <TableSkeleton {...props} />
      <div className="pf-c-pagination pf-m-bottom">
        <Skeleton width={"320px"} />
      </div>
    </Card>
  );
};
