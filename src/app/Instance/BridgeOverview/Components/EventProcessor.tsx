import { Card, CardTitle, GridItem } from "@patternfly/react-core";
import React from "react";
import { OBEmptyState } from "./OBEmptyState";
import { Data } from "../BridgeOverview";
import { OBDashboardTableView } from "./OBDashboardTableView";

interface EventProcessorProps {
  EventProcessorList: Data[];
  changeState: () => void;
}

export const EventProcessor = (props: EventProcessorProps): JSX.Element => {
  const { EventProcessorList, changeState } = props;
  const desc =
    "Processors use Camel DSL to filter and transform events before routing events to one or more actions";

  return (
    <>
      <GridItem lg={4} md={6}>
        <Card>
          <CardTitle>Event processing</CardTitle>
          {EventProcessorList.length == 0 ? (
            <OBEmptyState
              title={"No processors"}
              description={desc}
              buttonName={"Create processor"}
              variant={"secondary"}
              changeState={changeState}
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
