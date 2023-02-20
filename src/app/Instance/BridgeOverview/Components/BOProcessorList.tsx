import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Title,
} from "@patternfly/react-core";
import { BOEmptyState } from "./BOEmptyState";
import { BODashboardTableView } from "./BODashboardTableView";
import { useTranslation } from "@rhoas/app-services-ui-components";
import {
  ManagedResourceStatus,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import { BODashboardSkeleton } from "./BODashboardSkeleton";

import { convertProcessorsToTableItems } from "./BOUtils";

export interface BOProcessorListProps {
  instanceId: string;
  processorList: ProcessorResponse[] | undefined;
  bridgeStatus: string | undefined;
  processorsError: unknown;
  onCreateProcessor: () => void;
  onEditProcessor: (processorId: string) => void;
  deleteProcessor: (processorId: string, processorName: string) => void;
}

export const BOProcessorList = (props: BOProcessorListProps): JSX.Element => {
  const {
    instanceId,
    processorList,
    bridgeStatus,
    processorsError,
    onCreateProcessor,
    deleteProcessor,
    onEditProcessor,
  } = props;

  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const itemsList = useMemo(
    () => convertProcessorsToTableItems(processorList, instanceId),
    [instanceId, processorList]
  );

  return (
    <>
      <Card>
        <CardTitle>{t("processor.eventProcessing")}</CardTitle>
        <CardBody>
          {processorsError && (
            <EmptyState>
              <Title headingLevel="h2" size="md">
                {t("common.unexpectedError")}
              </Title>
              <EmptyStateBody>
                {t("instance.errors.processorsListGenericError")}
              </EmptyStateBody>
            </EmptyState>
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
                onDeleteItem={deleteProcessor}
                onEditItem={onEditProcessor}
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
