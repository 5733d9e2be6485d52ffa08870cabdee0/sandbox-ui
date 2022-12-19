import {
  Card,
  CardTitle,
  ClipboardCopy,
  ClipboardCopyVariant,
  Divider,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import React from "react";
import { DemoData } from "../BridgeOverview";
import { OBDashboardTableView } from "./OBDashboardTableView";
import { OBEmptyState } from "./OBEmptyState";

interface EventSourceProps {
  eventSourceList: DemoData[];
  onAddingSourceConnector: () => void;
}

export const EventSource = (props: EventSourceProps): JSX.Element => {
  const { eventSourceList, onAddingSourceConnector } = props;

  const desc =
    "Create a source connector to send events from an external system to this bridge";

  return (
    <>
      <GridItem lg={4} md={6}>
        <Card>
          <CardTitle>Event sources</CardTitle>
          {eventSourceList.length == 0 ? (
            <>
              <OBEmptyState
                title={"No source connectors"}
                description={desc}
                buttonName={"Create source connector"}
                variant={"secondary"}
                changeState={onAddingSourceConnector}
              />
              <Divider inset={{ default: "insetMd" }} />
            </>
          ) : (
            <OBDashboardTableView
              name={"Source connectors"}
              data={eventSourceList}
            />
          )}

          <Stack hasGutter style={{ padding: "1rem" }}>
            <StackItem>
              <Title headingLevel={"h4"}>{"Ingress endpoint URL"}</Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component="p">
                  {
                    "To ingest events into the smart Events bridge, use a CloudEvents message to send POST requests to the ingress endpoint URL"
                  }
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <ClipboardCopy
                isReadOnly
                hoverTip="Copy"
                clickTip="Copied"
                variant={ClipboardCopyVariant.expansion}
              >
                {"Ingress endpoint"}
              </ClipboardCopy>
            </StackItem>
          </Stack>
        </Card>
      </GridItem>
    </>
  );
};
