import React, { FunctionComponent } from "react";
import {
  Breadcrumb as PFBreadcrumb,
  BreadcrumbItem,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";

export interface BreadcrumbProps {
  /** Path describing the whole breadcrumb */
  path: {
    /** Linking this path item with a specific location */
    linkTo?: string;
    /** Label for this path item */
    label: string;
  }[];
}

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = ({ path }) => {
  return (
    <PFBreadcrumb ouiaId="breadcrumb">
      {path.map((pathItem, itemIndex) => {
        const isLastItem = itemIndex === path.length - 1;
        return (
          <BreadcrumbItem
            data-ouia-component-type="breadcrumb-item"
            data-ouia-component-id={pathItem.label}
            key={itemIndex}
            isActive={isLastItem}
            render={({ className }): React.ReactNode =>
              pathItem.linkTo ? (
                <Link to={pathItem.linkTo} className={className}>
                  {pathItem.label}
                </Link>
              ) : (
                pathItem.label
              )
            }
          />
        );
      })}
    </PFBreadcrumb>
  );
};
