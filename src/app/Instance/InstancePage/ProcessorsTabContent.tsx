import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  TableColumn,
  TableWithPagination,
} from "@app/components/TableWithPagination/TableWithPagination";
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  PageSection,
  Skeleton,
  Title,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IAction, IRowData } from "@patternfly/react-table";
import {
  BridgeResponse,
  ManagedResourceStatus,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import { Link, useHistory } from "react-router-dom";
import { formatDistance } from "date-fns";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { ErrorWithDetail } from "../../../types/Error";
import { TableWithPaginationSkeleton } from "@app/components/TableWithPaginationSkeleton/TableWithPaginationSkeleton";
import { canDeleteResource } from "@utils/resourceUtils";
import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";

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

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [currentPageSize, setCurrentPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);
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
    isLoading: areProcessorsLoading,
    error: processorsError,
  } = useGetProcessorsApi();

  const customToolbarElement = !bridgeStatus ? (
    <Skeleton width={"170px"} height={"35px"} />
  ) : (
    <Button
      ouiaId="create-processor"
      variant="primary"
      isDisabled={bridgeStatus !== ManagedResourceStatus.Ready}
      onClick={(): void =>
        history.push(`/instance/${instanceId}/create-processor`)
      }
    >
      {t("processor.createProcessor")}
    </Button>
  );

  const triggerGetProcessors = useCallback(
    (): void =>
      getProcessors(instanceId, currentPage, currentPageSize, undefined, true),
    [currentPage, currentPageSize, getProcessors, instanceId]
  );

  const onPaginationChange = useCallback(
    (pageNumber: number, pageSize: number): void => {
      const correctPageNumber =
        pageSize === currentPageSize ? pageNumber : FIRST_PAGE;
      setCurrentPage(correctPageNumber);
      setCurrentPageSize(pageSize);
      getProcessors(instanceId, correctPageNumber, pageSize);
    },
    [currentPageSize, getProcessors, instanceId]
  );

  const handleOnDeleteProcessorSuccess = useCallback((): void => {
    setShowProcessorDeleteModal(false);
    getProcessors(instanceId, currentPage, currentPageSize);
  }, [getProcessors, instanceId, currentPage, currentPageSize]);

  const rowOuiaId = useCallback(
    (row): string | undefined => (row as ProcessorResponse).name,
    []
  );

  const renderActions = useCallback(
    ({ row, ActionsColumn }): JSX.Element => (
      <ActionsColumn items={tableActions(row as IRowData)} />
    ),
    [tableActions]
  );

  usePolling(() => triggerGetProcessors(), 10000);

  useEffect(
    () => getProcessors(instanceId, FIRST_PAGE, DEFAULT_PAGE_SIZE),
    [getProcessors, instanceId]
  );

  useEffect(() => {
    if (processorListResponse) {
      setCurrentPage(processorListResponse.page ?? FIRST_PAGE);
      setTotalRows(processorListResponse.total ?? 0);
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
        {processorListResponse?.items ? (
          <TableWithPagination
            columns={processorsOverviewColumns}
            customToolbarElement={customToolbarElement}
            rows={processorListResponse.items}
            tableLabel={t(
              "smartEventsTempDictionary:processor.processorsListTable"
            )}
            getRowOuiaId={rowOuiaId}
            isLoading={areProcessorsLoading}
            onPaginationChange={onPaginationChange}
            pageNumber={currentPage}
            pageSize={currentPageSize}
            totalRows={totalRows ?? 0}
            renderActions={renderActions}
          >
            <EmptyState variant="large">
              <EmptyStateIcon icon={PlusCircleIcon} />
              <Title headingLevel="h2" size="lg">
                {t("processor.noProcessors")}
              </Title>
            </EmptyState>
          </TableWithPagination>
        ) : (
          <TableWithPaginationSkeleton
            hasActionColumn={true}
            columns={processorsOverviewColumns}
            totalRows={currentPageSize}
            customToolbarElement={customToolbarElement}
          />
        )}
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
