import React from "react";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
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
import "./BODashboardTableView.css";

interface BODashboardTableViewProps {
  demoData: DemoData[];
  name: string;
}

export const BODashboardTableView = (
  props: BODashboardTableViewProps
): JSX.Element => {
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
      <Divider className={"BO-Dashboard__resource__divider"} />
      <TableComposable variant="compact">
        {demoData &&
          demoData.map((processor, rowIndex) => (
            <Tbody key={rowIndex}>
              <Tr>
                <Td>
                  <Stack>
                    <StackItem>
                      <Flex flexWrap={{ default: "nowrap" }}>
                        <FlexItem>
                          <TextContent>
                            <Text component="h4">
                              <a href="#">
                                {" "}
                                <Truncate
                                  content={processor.name}
                                  className={
                                    "BO-Dashboard__resource__truncated-string"
                                  }
                                />
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
                    <StackItem
                      key={rowIndex}
                      className={"BO-Dashboard__resource__labels"}
                    >
                      <LabelGroup>
                        {processor.connectors?.map((connector, rowIndex) => (
                          <Label key={rowIndex} color="green">
                            <Truncate
                              content={connector}
                              className={
                                "BO-Dashboard__resource__truncated-string"
                              }
                            />
                          </Label>
                        ))}
                      </LabelGroup>
                    </StackItem>
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
