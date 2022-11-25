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
import {
  TableView,
  usePaginationSearchParams,
  useTranslation,
} from "@rhoas/app-services-ui-components";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { ErrorWithDetail } from "../../../types/Error";
import { canDeleteResource } from "@utils/resourceUtils";
import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import { renderCell, renderHeader, TableColumn } from "@utils/tableUtils";
import { EmptyState } from "@app/components/EmptyState/EmptyState";

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

  const { page, perPage, setPagination } = usePaginationSearchParams();

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
        accessor: "type",
        label: t("common.type"),
        formatter: (value: unknown): string => {
          const typeString = value as string;
          return !typeString || !typeString.length
            ? ""
            : typeString.charAt(0).toUpperCase() +
                typeString.slice(1).toLowerCase();
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

  const triggerGetProcessors = useCallback(
    (): void => getProcessors(instanceId, page, perPage, undefined, true),
    [getProcessors, instanceId, page, perPage]
  );

  const handleOnDeleteProcessorSuccess = useCallback((): void => {
    setShowProcessorDeleteModal(false);
    getProcessors(instanceId, page, perPage);
  }, [getProcessors, instanceId, page, perPage]);

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

  const emptyStateNoData = (
    <EmptyState
      title={t("processor.noProcessors")}
      createButton={{
        title: t("processor.createProcessor"),
        onCreate: onCreateProcessor,
        isDisabled: bridgeStatus !== ManagedResourceStatus.Ready,
      }}
    />
  );

  usePolling(() => triggerGetProcessors(), 10000);

  useEffect(
    () => getProcessors(instanceId, page, perPage),
    [getProcessors, instanceId, page, perPage]
  );

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
          emptyStateNoData={emptyStateNoData}
          emptyStateNoResults={
            emptyStateNoData
          } /** TODO https://issues.redhat.com/browse/MGDOBR-1229 */
          itemCount={totalRows}
          onPageChange={setPagination}
          page={page}
          perPage={perPage}
          renderActions={renderActions}
          renderHeader={renderHeader}
          renderCell={renderCell}
          setRowOuiaId={rowOuiaId}
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
