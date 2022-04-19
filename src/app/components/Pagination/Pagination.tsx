import React, { FunctionComponent } from "react";

import {
  Pagination as PFPagination,
  PaginationVariant,
} from "@patternfly/react-core";

interface PaginationProps {
  /** Custom class name */
  className?: string;
  /** Number of elements */
  itemCount: number;
  /** Current page number */
  page: number;
  /** Number of elements displayed for each page */
  perPage: number;
  /** Function triggered when the page number, or the number of elements displayed in each page, get changed */
  onChange: (page: number, perPage: number) => void;
  /** Indicates if pagination is compact  */
  isCompact?: boolean;
  /** Pagination variant */
  variant?: PaginationVariant;
  /** data-ouia-component-id identifier for automated UI testing */
  ouiaId?: string;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  className,
  itemCount,
  page,
  perPage,
  onChange,
  isCompact = false,
  variant,
  ouiaId,
}) => (
  <PFPagination
    data-ouia-component-type="pagination-control"
    ouiaId={ouiaId}
    className={className}
    style={{ float: "right" }}
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
    onSetPage={(_, page): void => onChange(page, perPage)}
    onPerPageSelect={(_, perPage): void => onChange(page, perPage)}
    isCompact={isCompact}
    variant={variant}
  />
);
