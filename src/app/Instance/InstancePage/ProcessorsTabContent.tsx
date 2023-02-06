import { PageSection } from "@patternfly/react-core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IAction, IRowData } from "@patternfly/react-table";
import {
  BridgeResponse,
  ManagedResourceStatus,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import { Link, useHistory } from "react-router-dom";
import { formatDistance } from "date-fns";
import { TableView, useTranslation } from "@rhoas/app-services-ui-components";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { ErrorWithDetail } from "../../../types/Error";
import { canDeleteResource } from "@utils/resourceUtils";
import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import { renderCell, renderHeader, TableColumn } from "@utils/tableUtils";
import { EmptyStateNoData } from "@app/components/EmptyState/EmptyStateNoData";
import { EmptyStateNoResults } from "@app/components/EmptyState/EmptyStateNoResults";
import { useTablePageParams } from "../../../hooks/useTablePageParams/useTablePageParams";

interface ProcessorTabContentProps {
  instanceId: string;
  pageTitle: JSX.Element;
  bridgeStatus: string | undefined;
}

export const ProcessorsTabContent = ({
  instanceId,
  pageTitle,
  bridgeStatus,
}: ProcessorTabContentProps): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const {
    pagination: { page, perPage, setPagination },
    filters: {
      filtersConfig: filters,
      onClearAllFilters,
      nameSearchParam,
      statuses,
    },
  } = useTablePageParams({ hasNameFilter: true, hasStatusesFilter: true });

  const [totalRows, setTotalRows] = useState<number>();
  const [deleteProcessorId, setDeleteProcessorId] = useState("");
  const [deleteProcessorName, setDeleteProcessorName] = useState("");
  const [showProcessorDeleteModal, setShowProcessorDeleteModal] =
    useState(false);

  const processorsOverviewColumns: TableColumn[] = useMemo(
    () => [
      {
        accessor: "name",
        label: t("common.name"),
        formatter: (value: unknown, row?: IRowData): JSX.Element => {
          const processorId = (row as BridgeResponse)?.id ?? "";
          return (
            <Link
              data-testid="tableProcessors-linkProcessor"
              to={`/instance/${instanceId}/processor/${processorId}`}
            >
              {value}
            </Link>
          );
        },
      },
      {
        accessor: "submitted_at",
        label: t("common.submittedAt"),
        formatter: (value: unknown): string => {
          const date = new Date(value as string);
          return formatDistance(date, new Date()) + " " + t("common.ago");
        },
      },
      {
        accessor: "status",
        label: t("common.status"),
        formatter: (value: unknown, row?: IRowData): JSX.Element => {
          const statusString = value as ManagedResourceStatus;
          const requestedAt = new Date(
            (row as ProcessorResponse).modified_at ??
              (row as ProcessorResponse).submitted_at
          );
          return (
            <SEStatusLabel
              status={statusString}
              resourceType={"processor"}
              requestedAt={requestedAt}
            />
          );
        },
      },
    ],
    [instanceId, t]
  );

  const deleteProcessor = (id: string, name: string): void => {
    setDeleteProcessorId(id);
    setDeleteProcessorName(name);
    setShowProcessorDeleteModal(true);
  };

  const tableActions = useCallback(
    (rowData: IRowData): IAction[] => [
      {
        title: t("common.delete"),
        onClick: (): void => {
          const id = (rowData as BridgeResponse).id;
          const name = (rowData as BridgeResponse).name;
          if (id && name) {
            deleteProcessor(id, name);
          }
        },
        isDisabled: !canDeleteResource((rowData as BridgeResponse).status),
      },
    ],
    [t]
  );

  const {
    getProcessors,
    processorListResponse,
    error: processorsError,
  } = useGetProcessorsApi();

  const triggerGetProcessors = useCallback((): void => {
    getProcessors(instanceId, nameSearchParam, page, perPage, statuses, true);
  }, [getProcessors, instanceId, nameSearchParam, page, perPage, statuses]);

  const handleOnDeleteProcessorSuccess = useCallback((): void => {
    setShowProcessorDeleteModal(false);
    getProcessors(instanceId, nameSearchParam, page, perPage, statuses);
  }, [getProcessors, instanceId, nameSearchParam, page, perPage, statuses]);

  const rowOuiaId = useCallback(
    ({ row, rowIndex }): string =>
      (row as ProcessorResponse).name ?? `table-row-${String(rowIndex)}`,
    []
  );

  const renderActions = useCallback(
    ({ row, ActionsColumn }): JSX.Element => (
      <ActionsColumn items={tableActions(row as IRowData)} />
    ),
    [tableActions]
  );

  const onCreateProcessor = (): void => {
    if (bridgeStatus === ManagedResourceStatus.Ready) {
      history.push(`/instance/${instanceId}/create-processor`);
    }
  };

  usePolling(() => triggerGetProcessors(), 10000);

  useEffect(() => {
    getProcessors(instanceId, nameSearchParam, page, perPage, statuses);
  }, [getProcessors, instanceId, nameSearchParam, page, perPage, statuses]);

  useEffect(() => {
    if (processorListResponse) {
      setTotalRows(processorListResponse.total);
    }
  }, [processorListResponse]);

  useEffect(() => {
    if (processorsError) {
      throw new ErrorWithDetail(
        pageTitle,
        t("instance.errors.processorsListGenericError")
      );
    }
  }, [pageTitle, processorsError, t]);

  return (
    <>
      <PageSection isFilled>
        <TableView
          ariaLabel={t(
            "smartEventsTempDictionary:processor.processorsListTable"
          )}
          actions={[
            /** TODO https://issues.redhat.com/browse/MGDOBR-1274 */
            {
              label: t("processor.createProcessor"),
              onClick: onCreateProcessor,
              isPrimary: true,
            },
          ]}
          columns={processorsOverviewColumns}
          data={processorListResponse?.items}
          emptyStateNoData={
            <EmptyStateNoData
              title={t("processor.noProcessors")}
              createButton={{
                title: t("processor.createProcessor"),
                onCreate: onCreateProcessor,
                isDisabled: bridgeStatus !== ManagedResourceStatus.Ready,
              }}
              quickStartGuide={{
                i18nKey: "common.quickStartAccess",
                onQuickstartGuide:
                  (): void => {} /* @TODO Quick start guide link missing */,
              }}
            />
          }
          emptyStateNoResults={
            <EmptyStateNoResults
              bodyMsgI18nKey={"common.adjustYourFilters"}
              onClearAllFilters={onClearAllFilters}
              title={t("processor.noProcessors")}
            />
          }
          filters={filters}
          itemCount={totalRows}
          isFiltered={
            (nameSearchParam && nameSearchParam.length > 0) ||
            (statuses && statuses.length > 0)
          }
          onClearAllFilters={onClearAllFilters}
          onPageChange={setPagination}
          page={page}
          perPage={perPage}
          renderActions={renderActions}
          renderHeader={renderHeader}
          renderCell={renderCell}
          setRowOuiaId={rowOuiaId}
          tableOuiaId={t(
            "smartEventsTempDictionary:processor.processorsListTable"
          )}
        />
      </PageSection>
      <DeleteProcessor
        bridgeId={instanceId}
        processorId={deleteProcessorId}
        processorName={deleteProcessorName}
        showDeleteModal={showProcessorDeleteModal}
        onCanceled={(): void => setShowProcessorDeleteModal(false)}
        onDeleted={handleOnDeleteProcessorSuccess}
      />
    </>
  );
};
