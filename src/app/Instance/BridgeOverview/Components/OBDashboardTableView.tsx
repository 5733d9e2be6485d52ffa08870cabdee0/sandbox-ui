import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import {
  Button,
  CardBody,
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
import React from "react";
import { ProcessorList } from "../BridgeOverview";

interface ProcessorTableViewProps {
  data: ProcessorList[];
  name: string;
}

export const OBDashboardTableView = (
  props: ProcessorTableViewProps
): JSX.Element => {
  const rowActions = [{ title: "edit" }, { title: "delete" }];

  const { data, name } = props;

  return (
    <>
      <CardBody>
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
      </CardBody>

      <Divider />
      <TableComposable variant="compact">
        {data &&
          data.map((processor, rowIndex) => (
            <Tbody key={rowIndex}>
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
