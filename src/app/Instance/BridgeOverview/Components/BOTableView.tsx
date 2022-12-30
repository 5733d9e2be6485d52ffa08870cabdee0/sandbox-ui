import React from "react";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  Label,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Truncate,
} from "@patternfly/react-core";
import {
  ActionsColumn,
  TableComposable,
  Tbody,
  Td,
  Tr,
} from "@patternfly/react-table";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { DemoData } from "../BridgeOverview";

interface BOTableViewProps {
  demoData: DemoData[];
  name: string;
}

export const BOTableView = (props: BOTableViewProps): JSX.Element => {
  const rowActions = [{ title: "Edit" }, { title: "Delete" }];

  const { demoData, name } = props;

  return (
    <>
      <Split hasGutter>
        <SplitItem isFilled>
          <TextContent>
            <Text component="h4">{name}</Text>
          </TextContent>
        </SplitItem>
        <SplitItem>
          <Button variant="secondary">Create {name}</Button>
        </SplitItem>
      </Split>
      <Divider style={{ paddingTop: "1rem" }} />
      <TableComposable variant="compact">
        {demoData &&
          demoData.map((processor, rowIndex) => (
            <Tbody key={rowIndex} style={{ border: "0rem" }}>
              <Tr>
                <Td>
                  <Stack>
                    <StackItem>
                      <Flex>
                        <FlexItem style={{ flexBasis: "100px" }}>
                          <TextContent>
                            <Text component="h4">
                              <a href="#">
                                {" "}
                                <Truncate content={processor.name}></Truncate>
                              </a>
                            </Text>
                          </TextContent>
                        </FlexItem>
                        <FlexItem>
                          {processor.status != ManagedResourceStatus.Ready && (
                            <SEStatusLabel
                              status={processor.status}
                              resourceType={"bridge"}
                              requestedAt={new Date()}
                            />
                          )}
                        </FlexItem>
                      </Flex>
                    </StackItem>

                    {processor.connectors?.map((connector, rowIndex) => (
                      <StackItem key={rowIndex} style={{ padding: "0.2rem" }}>
                        <Label color="green">{connector}</Label>
                      </StackItem>
                    ))}
                  </Stack>
                </Td>
                <Td isActionCell>
                  {rowActions ? <ActionsColumn items={rowActions} /> : null}
                </Td>
              </Tr>
            </Tbody>
          ))}
      </TableComposable>
    </>
  );
};
