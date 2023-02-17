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
import { BODashboardTableView } from "./BODashboardTableView";
import { BOEmptyState } from "./BOEmptyState";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { BOTableItem } from "./BODashboardTableView";

export interface BOSinkListProps {
  sinkList: BOTableItem[];
}

export const BOSinkList = (props: BOSinkListProps): JSX.Element => {
  const { sinkList } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  return (
    <Card>
      <CardTitle>{t("sinkConnector.eventSinks")}</CardTitle>
      <CardBody>
        {sinkList.length == 0 ? (
          <>
            <BOEmptyState
              title={t("sinkConnector.noSinkConnectors")}
              description={t("sinkConnector.noSinkConnectorsDescription")}
              createButton={{
                title: t("sinkConnector.createSinkConnector"),
                onCreate: (): void => {},
                isDisabled: false,
              }}
              variant={"primary"}
            />
            <Divider />
          </>
        ) : (
          <BODashboardTableView
            name={t("sinkConnector.sinkConnectors")}
            deleteProcessor={(): void => {}}
            onEditProcessor={(): void => {}}
            createButton={{
              title: t("sinkConnector.createSinkConnector"),
              onCreate: (): void => {},
              isDisabled: false,
            }}
            itemsList={[]}
          />
        )}
      </CardBody>
      <CardFooter>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel={"h4"}>{t("sinkConnector.sendToBridge")}</Title>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="p">
                {t("sinkConnector.sendToBridgeDescription")}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Title headingLevel={"h4"}>
              {t("sinkConnector.sendThroughErrorHandling")}
            </Title>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="p">
                {t("sinkConnector.sendThroughErrorHandlingDescription")}
              </Text>
            </TextContent>
          </StackItem>
        </Stack>
      </CardFooter>
    </Card>
  );
};
