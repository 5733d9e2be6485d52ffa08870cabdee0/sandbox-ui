import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { DemoData } from "../BridgeOverview";
import { BODashboardTableView } from "./BODashboardTableView";
import { BOEmptyState } from "./BOEmptyState";

interface BOSinkListProps {
  sinkList: DemoData[];
  onAddingSinkConnector: () => void;
}

export const BOSinkList = (props: BOSinkListProps): JSX.Element => {
  const { sinkList, onAddingSinkConnector } = props;
  const desc =
    "Create a source connector to send events from an external system to this bridge";

  return (
    <Card>
      <CardTitle>Event sinks</CardTitle>
      <CardBody>
        {sinkList.length == 0 ? (
          <>
            <BOEmptyState
              title={"No sink connectors"}
              description={desc}
              buttonLabel={"Create sink connector"}
              onButtonClick={onAddingSinkConnector}
              variant={"primary"}
            />
            <Divider />
          </>
        ) : (
          <BODashboardTableView name={"sink connectors"} demoData={sinkList} />
        )}
      </CardBody>
      <CardFooter>
        <Stack hasGutter>
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
      </CardFooter>
    </Card>
  );
};
