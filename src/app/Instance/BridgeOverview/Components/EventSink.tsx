import {
  Card,
  CardTitle,
  Divider,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import React from "react";
import { Data } from "../BridgeOverview";
import { OBDashboardTableView } from "./OBDashboardTableView";
import { OBEmptyState } from "./OBEmptyState";

interface EventSinkProps {
  EventSinkList: Data[];
  changeState: () => void;
}

export const EventSink = (props: EventSinkProps): JSX.Element => {
  const { EventSinkList, changeState } = props;
  const desc =
    "Create a source connector to send events from an external system to this bridge";

  return (
    <>
      <GridItem lg={4} md={12}>
        <Card>
          <CardTitle>Event sinks</CardTitle>
          {EventSinkList.length == 0 ? (
            <>
              <OBEmptyState
                title={"No sink connectors"}
                description={desc}
                buttonName={"Create sink connector"}
                changeState={changeState}
                variant={"primary"}
              />
              <Divider inset={{ default: "insetMd" }} />
            </>
          ) : (
            <OBDashboardTableView
              name={"sink connector"}
              data={EventSinkList}
            />
          )}

          <Stack hasGutter style={{ padding: "1rem" }}>
            <StackItem>
              <Title headingLevel={"h4"}>Send to bridge</Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component="p">
                  {
                    "Processors can be send an event payload back to the bridge for additional processing"
                  }
                </Text>
              </TextContent>
            </StackItem>
          </Stack>
          <Stack hasGutter style={{ padding: "1rem" }}>
            <StackItem>
              <Title headingLevel={"h4"}>Send through error handling</Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component="p">
                  {
                    "Processors can route an event payload through the error handling method"
                  }
                </Text>
              </TextContent>
            </StackItem>
          </Stack>
        </Card>
      </GridItem>
    </>
  );
};
