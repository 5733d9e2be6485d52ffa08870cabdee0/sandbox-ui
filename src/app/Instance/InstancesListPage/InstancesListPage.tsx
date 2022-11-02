import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@rhoas/app-services-ui-components";
import {
  Button,
  Drawer,
  DrawerContent,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { IAction, IRow, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  TableWithPagination,
} from "@app/components/TableWithPagination/TableWithPagination";
import CreateInstance, {
  CreateInstanceProps,
} from "@app/Instance/CreateInstance/CreateInstance";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import { useGetBridgesApi } from "../../../hooks/useBridgesApi/useGetBridgesApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { TableWithPaginationSkeleton } from "@app/components/TableWithPaginationSkeleton/TableWithPaginationSkeleton";
import {
  BridgeResponse,
  ManagedResourceStatus,
} from "@rhoas/smart-events-management-sdk";
import DeleteInstance from "@app/Instance/DeleteInstance/DeleteInstance";
import { TableRow } from "@app/components/Table";
import { canDeleteResource, canEditResource } from "@utils/resourceUtils";
import { ErrorWithDetail } from "../../../types/Error";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import { useCreateBridgeApi } from "../../../hooks/useBridgesApi/useCreateBridgeApi";
import { useGetCloudProvidersWithRegionsApi } from "../../../hooks/useCloudProvidersApi/useGetProvidersWithRegionsApi";

const InstancesListPage = (): JSX.Element => {
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [currentPageSize, setCurrentPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);
  const [totalRows, setTotalRows] = useState<number>();
  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<BridgeResponse>();

  const pageTitleElement = useMemo(
    () => (
      <TextContent>
        <Text ouiaId="instances-page-title" component="h1">
          {t("smartEventsTempDictionary:instance.instancesListPageTitle")}
        </Text>
      </TextContent>
    ),
    [t]
  );

  const columnNames = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const bridgeId = (row as BridgeResponse)?.id ?? "";
        const status = (row as BridgeResponse)?.status;

        return canEditResource(status) ? (
          <Link
            data-testid="tableInstances-linkInstance"
            to={`/instance/${bridgeId}`}
          >
            {value}
          </Link>
        ) : (
          <>{value}</>
        );
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
          (row as BridgeResponse)?.modified_at ??
            (row as BridgeResponse)?.submitted_at
        );
        return (
          <SEStatusLabel
            status={statusString}
            resourceType={"bridge"}
            requestedAt={requestedAt}
          />
        );
      },
    },
  ];

  const { bridgeListResponse, isLoading, getBridges, error } =
    useGetBridgesApi();

  const triggerGetBridges = useCallback(
    (): void => getBridges(currentPage, currentPageSize, true),
    [currentPage, currentPageSize, getBridges]
  );

  usePolling(() => triggerGetBridges(), 10000);

  useEffect(() => {
    getBridges(FIRST_PAGE, DEFAULT_PAGE_SIZE);
  }, [getBridges]);

  useEffect(() => {
    if (bridgeListResponse) {
      setCurrentPage(bridgeListResponse.page ?? FIRST_PAGE);
      setTotalRows(bridgeListResponse.total ?? 0);
      if (selectedInstance) {
        const updatedInstance = bridgeListResponse.items?.find(
          (bridge) => bridge.id === selectedInstance.id
        );
        if (updatedInstance) {
          setSelectedInstance(updatedInstance);
        }
      }
    }
  }, [bridgeListResponse, selectedInstance]);

  useEffect(() => {
    if (error) {
      throw new ErrorWithDetail(
        pageTitleElement,
        t("instance.errors.instancesListGenericError")
      );
    }
  }, [error, pageTitleElement, t]);

  const [showCreateInstance, setShowCreateInstance] = useState(false);
  const { createBridge } = useCreateBridgeApi();
  const { getCloudProvidersWithRegions } = useGetCloudProvidersWithRegionsApi();
  const { getSchema } = useGetSchemaApi();

  const onCreateBridge = useCallback(() => {
    setShowCreateInstance(false);
    getBridges(currentPage, currentPageSize);
  }, [getBridges, currentPage, currentPageSize]);

  const handleCreate = useCallback<CreateInstanceProps["createBridge"]>(
    function (data, onSuccess, onError) {
      const handleOnSuccess = (): void => {
        onSuccess();
        onCreateBridge();
      };
      createBridge(data, handleOnSuccess, onError);
    },
    [onCreateBridge, createBridge]
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInstanceId, setDeleteInstanceId] = useState<string>();
  const [deleteInstanceName, setDeleteInstanceName] = useState<string>();

  const deleteInstance = (id: string, name: string): void => {
    setDeleteInstanceId(id);
    setDeleteInstanceName(name);
    setShowDeleteModal(true);
  };

  const resetDeleteInstance = useCallback((): void => {
    setDeleteInstanceId("");
    setDeleteInstanceName("");
  }, []);

  const handleOnDeleteSuccess = useCallback((): void => {
    setShowDeleteModal(false);
    getBridges(currentPage, currentPageSize);
    resetDeleteInstance();
  }, [currentPage, currentPageSize, getBridges, resetDeleteInstance]);

  const handleOnDeleteCancel = useCallback((): void => {
    setShowDeleteModal(false);
    resetDeleteInstance();
  }, [resetDeleteInstance]);

  const tableActions = (rowData: TableRow): IAction[] => [
    {
      title: t("common.details"),
      onClick: (): void => {
        setSelectedInstance(rowData.originalData as BridgeResponse);
        setShowInstanceDrawer(true);
      },
    },
    {
      title: t("instance.delete"),
      onClick: (): void => {
        const id = (rowData.originalData as BridgeResponse).id;
        const name = (rowData.originalData as BridgeResponse).name;
        if (id && name) {
          deleteInstance(id, name);
        }
      },
      isDisabled: !canDeleteResource(
        (rowData.originalData as BridgeResponse).status
      ),
    },
  ];

  const customToolbarElement = (
    <>
      <Button
        ouiaId="create-smart-event-instance"
        onClick={(): void => setShowCreateInstance(true)}
      >
        {t("instance.createSEInstance")}
      </Button>
      <CreateInstance
        isOpen={showCreateInstance}
        onClose={(): void => setShowCreateInstance((prev) => !prev)}
        getCloudProviders={getCloudProvidersWithRegions}
        getSchema={getSchema}
        createBridge={handleCreate}
      />
    </>
  );

  const onPaginationChange = useCallback(
    (pageNumber: number, pageSize: number): void => {
      const correctPageNumber =
        pageSize === currentPageSize ? pageNumber : FIRST_PAGE;
      setCurrentPage(correctPageNumber);
      setCurrentPageSize(pageSize);
      getBridges(correctPageNumber, pageSize);
    },
    [currentPageSize, getBridges]
  );

  const pageContent = (
    <>
      <PageSection variant={PageSectionVariants.light}>
        {pageTitleElement}
      </PageSection>
      <PageSection>
        {totalRows === undefined && isLoading && (
          <TableWithPaginationSkeleton
            columns={columnNames}
            customToolbarElement={customToolbarElement}
            totalRows={currentPageSize}
            hasActionColumn={true}
          />
        )}
        {bridgeListResponse?.items && (
          <TableWithPagination
            columns={columnNames}
            customToolbarElement={customToolbarElement}
            isLoading={isLoading}
            rows={bridgeListResponse.items}
            totalRows={totalRows ?? 0}
            pageNumber={currentPage}
            pageSize={currentPageSize}
            onPaginationChange={onPaginationChange}
            tableLabel={t(
              "smartEventsTempDictionary:instance.instancesListTable"
            )}
            renderActions={({ row, ActionsColumn }): JSX.Element => (
              <ActionsColumn items={tableActions(row)} />
            )}
          >
            <EmptyState variant="large">
              <EmptyStateIcon icon={PlusCircleIcon} />
              <Title headingLevel="h2" size="lg">
                {t("instance.noInstances")}
              </Title>
              <EmptyStateBody>
                {/* @TODO Quick start guide link missing */}
                {t("common.quickStartAccess")}
              </EmptyStateBody>
            </EmptyState>
          </TableWithPagination>
        )}
      </PageSection>
    </>
  );

  return (
    <>
      <Drawer isExpanded={showInstanceDrawer}>
        <DrawerContent
          data-ouia-component-id="instance-drawer"
          panelContent={
            selectedInstance ? (
              <InstanceDetails
                onClosingDetails={(): void => setShowInstanceDrawer(false)}
                instance={selectedInstance}
              />
            ) : null
          }
        >
          {pageContent}
        </DrawerContent>
      </Drawer>
      <DeleteInstance
        showDeleteModal={showDeleteModal}
        instanceId={deleteInstanceId}
        instanceName={deleteInstanceName}
        onDeleted={handleOnDeleteSuccess}
        onCanceled={handleOnDeleteCancel}
      />
    </>
  );
};

export default InstancesListPage;
