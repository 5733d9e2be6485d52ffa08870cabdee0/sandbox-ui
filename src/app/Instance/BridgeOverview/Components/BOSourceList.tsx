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
import { BODashboardTableView, BOTableItem } from "./BODashboardTableView";
import { BOEmptyState } from "./BOEmptyState";
import { useTranslation } from "@rhoas/app-services-ui-components";

export interface BOSourceListProps {
  sourceList: BOTableItem[];
  bridgeIngressEndpoint: string | undefined;
}

export const BOSourceList = (props: BOSourceListProps): JSX.Element => {
  const { sourceList, bridgeIngressEndpoint } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  return (
    <Card>
      <CardTitle>Event sources</CardTitle>
      <CardBody>
        {sourceList.length == 0 ? (
          <>
            <BOEmptyState
              title={t("sourceConnector.noSourceConnectors")}
              description={t("sourceConnector.noSourceConnectorsDescription")}
              createButton={{
                title: t("sourceConnector.createSourceConnector"),
                onCreate: (): void => {},
                isDisabled: false,
              }}
              variant={"secondary"}
            />
            <Divider />
          </>
        ) : (
          <BODashboardTableView
            name={t("sourceConnector.sourceConnectors")}
            createButton={{
              title: t("sourceConnector.createSourceConnector"),
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
            <Title headingLevel={"h4"}>{t("common.ingressEndpoint")}</Title>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="p">
                {t("common.ingressEndpointDescription")}
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
              {bridgeIngressEndpoint}
            </ClipboardCopy>
          </StackItem>
        </Stack>
      </CardFooter>
    </Card>
  );
};
