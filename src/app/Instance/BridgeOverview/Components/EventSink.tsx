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
import React, { useState } from "react";
import { ProcessorList } from "../BridgeOverview";
import { OBDashboardTableView } from "./OBDashboardTableView";
import { OBEmptyState } from "./OBEmptyState";

interface EventSinkProps {
  EventSinkList: ProcessorList[];
}

export const EventSink = (props: EventSinkProps): JSX.Element => {
  const [hasSink, setHasSink] = useState<boolean>(false);
  const { EventSinkList } = props;
  const desc =
    "Create a source connector to send events from an external system to this bridge";

  const handleClick = (): void => {
    setHasSink(!hasSink);
  };

  return (
    <>
      <GridItem span={4}>
        <Card>
          <CardTitle>Event sinks</CardTitle>
          {!hasSink ? (
            <>
              {" "}
              <OBEmptyState
                title={"No sink connectors"}
                description={desc}
                buttonName={"Create sink connector"}
                changeState={handleClick}
                variant={"primary"}
              />
              <Divider inset={{ default: "insetMd" }} />
            </>
          ) : (
            <>
              <OBDashboardTableView name={"processor"} data={EventSinkList} />
            </>
          )}

          <Stack hasGutter style={{ padding: "1rem" }}>
            <StackItem>
              <Title headingLevel={"h4"}>Send to bridge</Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component="p">
                  {
                    "Processors can be send an evnet payload back to the bridge for additional processing"
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
                    "Processors can route an evnet payload through the error handling method"
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
