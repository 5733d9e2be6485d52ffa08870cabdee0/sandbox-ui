import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { BOEmptyState } from "./BOEmptyState";
import { BODashboardTableView } from "./BODashboardTableView";
import { useTranslation } from "@rhoas/app-services-ui-components";
import {
  ManagedResourceStatus,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import { BODashboardSkeleton } from "./BODashboardSkeleton";
import { useHistory } from "react-router-dom";
import { convertProcessorsToTableItems } from "./BOUtils";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export interface BOProcessorListProps {
  instanceId: string;
  processorList: ProcessorResponse[] | undefined;
  bridgeStatus: string | undefined;
  processorsError: unknown;
}

export const BOProcessorList = (props: BOProcessorListProps): JSX.Element => {
  const { instanceId, processorList, bridgeStatus, processorsError } = props;
  const history = useHistory();
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const itemsList = useMemo(
    () => convertProcessorsToTableItems(processorList, instanceId),
    [instanceId, processorList]
  );

  const onCreateProcessor = (): void => {
    if (bridgeStatus === ManagedResourceStatus.Ready) {
      history.push(`/instance/${instanceId}/create-processor`);
    }
  };

  return (
    <>
      <Card>
        <CardTitle>{t("processor.eventProcessing")}</CardTitle>
        <CardBody>
          {processorsError && (
            <Stack hasGutter style={{ textAlign: "center" }}>
              <StackItem>
                <ExclamationCircleIcon color="grey" size="md" />
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component="h3">{t("common.unexpectedError")}</Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component="p">
                    {t("instance.errors.processorsListGenericError")}{" "}
                    {t("common.tryAgainLater")}
                  </Text>
                </TextContent>
              </StackItem>
            </Stack>
          )}
          {!processorsError &&
            (processorList?.length === 0 ? (
              <BOEmptyState
                title={t("processor.noProcessors")}
                description={t("processor.noProcessorsDescription")}
                createButton={{
                  title: t("processor.createProcessor"),
                  onCreate: onCreateProcessor,
                  isDisabled: bridgeStatus !== ManagedResourceStatus.Ready,
                }}
                variant={"secondary"}
              />
            ) : (
              <BODashboardTableView
                name={t("common.processors")}
                createButton={{
                  title: t("processor.createProcessor"),
                  onCreate: onCreateProcessor,
                  isDisabled: bridgeStatus !== ManagedResourceStatus.Ready,
                }}
                itemsList={itemsList}
              />
            ))}
          {!processorList && !processorsError && <BODashboardSkeleton />}
        </CardBody>
      </Card>
    </>
  );
};
