import { Card, CardTitle, GridItem } from "@patternfly/react-core";
import React, { useState } from "react";
import { OBEmptyState } from "./OBEmptyState";
import { ProcessorList } from "../BridgeOverview";
import { OBDashboardTableView } from "./OBDashboardTableView";

interface EventProcessorProps {
  EventProcessorList: ProcessorList[];
}

export const EventProcessor = (props: EventProcessorProps): JSX.Element => {
  const [hasProcessor, setHasProcessor] = useState<boolean>(false);
  const { EventProcessorList } = props;
  const desc =
    "Processors use Camel DSL to filter and transform events before routing events to one or more actions";

  return (
    <>
      <GridItem span={4}>
        <Card>
          <CardTitle>Event processing</CardTitle>
          {!hasProcessor ? (
            <OBEmptyState
              title={"No Processors"}
              description={desc}
              buttonName={"Create processor"}
              variant={"secondary"}
              changeState={(): void => setHasProcessor(!hasProcessor)}
            />
          ) : (
            <OBDashboardTableView
              name={"processor"}
              data={EventProcessorList}
            />
          )}
        </Card>
      </GridItem>
    </>
  );
};
