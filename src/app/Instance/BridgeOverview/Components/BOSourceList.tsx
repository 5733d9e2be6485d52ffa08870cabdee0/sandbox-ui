import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  ClipboardCopy,
  ClipboardCopyVariant,
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

interface BOSourceListProps {
  sourceList: DemoData[];
  onAddingSourceConnector: () => void;
}

export const BOSourceList = (props: BOSourceListProps): JSX.Element => {
  const { sourceList, onAddingSourceConnector } = props;

  const desc =
    "Create a source connector to send events from an external system to this bridge";

  return (
    <Card>
      <CardTitle>Event sources</CardTitle>
      <CardBody>
        {sourceList.length == 0 ? (
          <>
            <BOEmptyState
              title={"No source connectors"}
              description={desc}
              buttonLabel={"Create source connector"}
              variant={"secondary"}
              onButtonClick={onAddingSourceConnector}
            />
            <Divider />
          </>
        ) : (
          <BODashboardTableView
            name={"Source connectors"}
            demoData={sourceList}
          />
        )}
      </CardBody>
      <CardFooter>
        <Stack hasGutter>
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
      </CardFooter>
    </Card>
  );
};
