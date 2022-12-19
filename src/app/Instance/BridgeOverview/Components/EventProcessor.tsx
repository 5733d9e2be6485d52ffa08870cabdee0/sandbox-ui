import { Card, CardTitle, GridItem } from "@patternfly/react-core";
import React from "react";
import { OBEmptyState } from "./OBEmptyState";
import { DemoData } from "../BridgeOverview";
import { OBDashboardTableView } from "./OBDashboardTableView";

interface EventProcessorProps {
  eventProcessorList: DemoData[];
  onAddingProcessor: () => void;
}

export const EventProcessor = (props: EventProcessorProps): JSX.Element => {
  const { eventProcessorList, onAddingProcessor } = props;
  const desc =
    "Processors use Camel DSL to filter and transform events before routing events to one or more actions";

  return (
    <>
      <GridItem lg={4} md={6}>
        <Card>
          <CardTitle>Event processing</CardTitle>
          {eventProcessorList.length == 0 ? (
            <OBEmptyState
              title={"No processors"}
              description={desc}
              buttonName={"Create processor"}
              variant={"secondary"}
              changeState={onAddingProcessor}
            />
          ) : (
            <OBDashboardTableView
              name={"processor"}
              data={eventProcessorList}
            />
          )}
        </Card>
      </GridItem>
    </>
  );
};
