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
import "./BODashboardTableView.css";
import { Link } from "react-router-dom";
import { canDeleteResource, canEditResource } from "@utils/resourceUtils";

export interface BOTableItem {
  id: string;
  name: string;
  url: string;
  status: ManagedResourceStatus;
  labels: string[];
  modified_at?: string;
  submitted_at: string;
}

interface BODashboardTableViewProps {
  itemsList: BOTableItem[] | undefined;
  name: string;
  onEditItem: (processorId: string) => void;
  onDeleteItem: (processorId: string, processorName: string) => void;
  createButton: {
    title: string;
    onCreate: () => void;
    isDisabled?: boolean;
  };
}

export const BODashboardTableView = (
  props: BODashboardTableViewProps
): JSX.Element => {
  const { name, createButton, itemsList, onDeleteItem, onEditItem } = props;

  return (
    <>
      <Split hasGutter>
        <SplitItem isFilled>
          <TextContent>
            <Text component="h4">{name}</Text>
          </TextContent>
        </SplitItem>
        <SplitItem>
          <Button
            variant="secondary"
            isDisabled={createButton.isDisabled}
            onClick={createButton.onCreate}
          >
            {createButton.title}
          </Button>
        </SplitItem>
      </Split>
      <Divider className={"BO-Dashboard__resource__divider"} />
      <TableComposable variant="compact">
        <Tbody className={"BO-Dashboard__table-body"}>
          {itemsList?.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Stack>
                  <StackItem>
                    <Flex flexWrap={{ default: "nowrap" }}>
                      <FlexItem>
                        <TextContent>
                          <Text component="h4">
                            <Link to={item.url}>
                              {" "}
                              <Truncate
                                content={item.name}
                                className={
                                  "BO-Dashboard__resource__truncated-string"
                                }
                              />
                            </Link>
                          </Text>
                        </TextContent>
                      </FlexItem>
                      <FlexItem>
                        {item.status != ManagedResourceStatus.Ready && (
                          <SEStatusLabel
                            status={item.status}
                            resourceType={"processor"}
                            requestedAt={
                              new Date(item.modified_at ?? item.submitted_at)
                            }
                          />
                        )}
                      </FlexItem>
                    </Flex>
                  </StackItem>
                  <StackItem
                    key={item.id}
                    className={"BO-Dashboard__resource__labels"}
                  >
                    <LabelGroup>
                      {item.labels?.map((label, rowIndex) => (
                        <Label key={rowIndex} color="green">
                          <Truncate
                            content={label}
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
                {
                  <ActionsColumn
                    items={[
                      {
                        title: "Edit",
                        isDisabled: !canEditResource(item.status),
                        onClick: () => onEditItem(item.id),
                      },
                      {
                        title: "Delete",
                        isDisabled: !item || !canDeleteResource(item.status),
                        onClick: () => onDeleteItem(item.id, item.name),
                      },
                    ]}
                  />
                }
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </>
  );
};
