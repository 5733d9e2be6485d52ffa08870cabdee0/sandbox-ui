import React from "react";
import { Skeleton } from "@patternfly/react-core";
import { TableComposable, Tbody, Td, Tr } from "@patternfly/react-table";

export const BODashboardSkeleton = (): JSX.Element => {
  return (
    <>
      <TableComposable>
        <Tbody>
          <Tr>
            <Td>
              <Skeleton width="100%" />
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Skeleton width="100%" />
            </Td>
          </Tr>
        </Tbody>
      </TableComposable>
    </>
  );
};
