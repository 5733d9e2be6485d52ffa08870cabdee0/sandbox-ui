import React, { CSSProperties, FunctionComponent } from "react";

import { Pagination as PFPagination } from "@patternfly/react-core";

interface PaginationProps {
  style?: CSSProperties;
  /** Number of elements */
  itemCount: number;
  /** Current page number */
  page: number;
  /** Number of elements displayed for each page */
  perPage: number;
  /** Function triggered when the page gets changed */
  onChange: (page: number, perPage: number) => void;
  /** Indicates if pagination is compact  */
  isCompact?: boolean;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  style = {},
  itemCount,
  page,
  perPage,
  onChange,
  isCompact = false,
}) => (
  <PFPagination
    style={{ ...style, float: "right" }}
    itemCount={itemCount}
    page={page}
    perPage={perPage}
    perPageOptions={[
      {
        title: "1",
        value: 1,
      },
      {
        title: "5",
        value: 5,
      },
      {
        title: "10",
        value: 10,
      },
    ]}
    onSetPage={(_, page) => onChange(page, perPage)}
    onPerPageSelect={(_, perPage) => onChange(page, perPage)}
    isCompact={isCompact}
  />
);
