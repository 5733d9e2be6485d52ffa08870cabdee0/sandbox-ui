import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  TableWithPagination,
} from "@app/components/TableWithPagination/TableWithPagination";
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  TabContent,
  Title,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import React, { useCallback, useEffect, useState } from "react";
import { IAction, IRow, IRowData } from "@patternfly/react-table";
import {
  BridgeResponse,
  ManagedResourceStatus,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { ErrorWithDetail } from "../../../types/Error";
import { TableWithPaginationSkeleton } from "@app/components/TableWithPaginationSkeleton/TableWithPaginationSkeleton";
import { TableRow } from "@app/components/Table";
import { canDeleteResource } from "@utils/resourceUtils";
import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";

interface ProcessorTabContentProps {
  instanceId: string;
  pageTitle: JSX.Element;
}

export const ProcessorsTabContent = ({
  instanceId,
  pageTitle,
}: ProcessorTabContentProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [currentPageSize, setCurrentPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);
  const [totalRows, setTotalRows] = useState<number>();
  const [deleteProcessorId, setDeleteProcessorId] = useState("");
  const [deleteProcessorName, setDeleteProcessorName] = useState("");
  const [showProcessorDeleteModal, setShowProcessorDeleteModal] =
    useState(false);

  const processorsOverviewColumns = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
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
      formatter: (value: IRowData): string => {
        const typeString = value as unknown as string;
        return !typeString || !typeString.length
          ? ""
          : typeString.charAt(0).toUpperCase() +
              typeString.slice(1).toLowerCase();
      },
    },
    {
      accessor: "submitted_at",
      label: t("common.submittedAt"),
      formatter: (value: IRowData): string => {
        const date = new Date(value as unknown as string);
        return formatDistance(date, new Date()) + " " + t("common.ago");
      },
    },
    {
      accessor: "status",
      label: t("common.status"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const statusString = value as unknown as ManagedResourceStatus;
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
  ];

  const customToolbarElement = (
    <Link to={`/instance/${instanceId}/create-processor`}>
      <Button ouiaId="create-processor" variant="primary">
        {t("processor.createProcessor")}
      </Button>
    </Link>
  );

  const deleteProcessor = (id: string, name: string): void => {
    setDeleteProcessorId(id);
    setDeleteProcessorName(name);
    setShowProcessorDeleteModal(true);
  };

  const tableActions = (rowData: TableRow): IAction[] => [
    {
      title: t("common.delete"),
      onClick: (): void => {
        const id = (rowData.originalData as BridgeResponse).id;
        const name = (rowData.originalData as BridgeResponse).name;
        if (id && name) {
          deleteProcessor(id, name);
        }
      },
      isDisabled: !canDeleteResource(
        (rowData.originalData as BridgeResponse).status
      ),
    },
  ];

  const {
    getProcessors,
    processorListResponse,
    isLoading: areProcessorsLoading,
    error: processorsError,
  } = useGetProcessorsApi();

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
      {processorListResponse?.items ? (
        <TableWithPagination
          columns={processorsOverviewColumns}
          customToolbarElement={customToolbarElement}
          rows={processorListResponse.items}
          tableLabel={t(
            "openbridgeTempDictionary:processor.processorsListTable"
          )}
          isLoading={areProcessorsLoading}
          onPaginationChange={onPaginationChange}
          pageNumber={currentPage}
          pageSize={currentPageSize}
          totalRows={totalRows ?? 0}
          renderActions={({ row, ActionsColumn }): JSX.Element => (
            <ActionsColumn items={tableActions(row)} />
          )}
        >
          <EmptyState variant="large">
            <EmptyStateIcon icon={PlusCircleIcon} />
            <Title headingLevel="h4" size="lg">
              {t("processor.noProcessors")}
            </Title>
          </EmptyState>
        </TableWithPagination>
      ) : (
        <TabContent id="instance-skeleton__page__tabs-processors">
          <TableWithPaginationSkeleton
            hasActionColumn={true}
            columns={processorsOverviewColumns}
            totalRows={currentPageSize}
            customToolbarElement={customToolbarElement}
          />
        </TabContent>
      )}
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
