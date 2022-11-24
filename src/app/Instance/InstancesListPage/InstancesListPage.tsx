import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  TableView,
  usePaginationSearchParams,
  useTranslation,
} from "@rhoas/app-services-ui-components";
import {
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
import { IAction, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { TableColumn } from "@app/components/TableWithPagination/TableWithPagination";
import CreateInstance, {
  CreateInstanceProps,
} from "@app/Instance/CreateInstance/CreateInstance";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import { useGetBridgesApi } from "../../../hooks/useBridgesApi/useGetBridgesApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { PlusCircleIcon } from "@patternfly/react-icons";
import {
  BridgeResponse,
  ManagedResourceStatus,
} from "@rhoas/smart-events-management-sdk";
import DeleteInstance from "@app/Instance/DeleteInstance/DeleteInstance";
import { canDeleteResource, canEditResource } from "@utils/resourceUtils";
import { ErrorWithDetail } from "../../../types/Error";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import { useCreateBridgeApi } from "../../../hooks/useBridgesApi/useCreateBridgeApi";
import { useGetCloudProvidersWithRegionsApi } from "../../../hooks/useCloudProvidersApi/useGetProvidersWithRegionsApi";
import { renderCell, renderHeader } from "@utils/tableUtils";

const InstancesListPage = (): JSX.Element => {
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const { page, perPage, setPagination } = usePaginationSearchParams();

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

  const columnNames: TableColumn[] = useMemo(
    () => [
      {
        accessor: "name",
        label: t("common.name"),
        formatter: (value: unknown, row?: IRowData): JSX.Element => {
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
        formatter: (value: unknown): string => {
          const date = new Date(value as string);
          return formatDistance(date, new Date()) + " " + t("common.ago");
        },
      },
      {
        accessor: "status",
        label: t("common.status"),
        formatter: (value: unknown, row?: IRowData): JSX.Element => {
          const statusString = value;
          const requestedAt = new Date(
            (row as BridgeResponse)?.modified_at ??
              (row as BridgeResponse)?.submitted_at
          );
          return (
            <SEStatusLabel
              status={statusString as ManagedResourceStatus}
              resourceType={"bridge"}
              requestedAt={requestedAt}
            />
          );
        },
      },
    ],
    [t]
  );

  const { bridgeListResponse, getBridges, error } = useGetBridgesApi();

  const triggerGetBridges = useCallback(
    (): void => getBridges(page, perPage, true),
    [getBridges, page, perPage]
  );

  usePolling(() => triggerGetBridges(), 10000);

  useEffect(() => {
    getBridges(page, perPage);
  }, [getBridges, page, perPage]);

  useEffect(() => {
    if (bridgeListResponse) {
      setTotalRows(bridgeListResponse.total);
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
    getBridges(page, perPage);
  }, [getBridges, page, perPage]);

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
    getBridges(page, perPage);
    resetDeleteInstance();
  }, [getBridges, page, perPage, resetDeleteInstance]);

  const handleOnDeleteCancel = useCallback((): void => {
    setShowDeleteModal(false);
    resetDeleteInstance();
  }, [resetDeleteInstance]);

  const tableActions = useCallback(
    (rowData: IRowData): IAction[] => [
      {
        title: t("common.details"),
        onClick: (): void => {
          setSelectedInstance(rowData as BridgeResponse);
          setShowInstanceDrawer(true);
        },
      },
      {
        title: t("instance.delete"),
        onClick: (): void => {
          const id = (rowData as BridgeResponse).id;
          const name = (rowData as BridgeResponse).name;
          if (id && name) {
            deleteInstance(id, name);
          }
        },
        isDisabled: !canDeleteResource((rowData as BridgeResponse).status),
      },
    ],
    [t]
  );

  const rowOuiaId = useCallback(
    ({ row, rowIndex }): string =>
      (row as BridgeResponse).name ?? `table-row-${String(rowIndex)}`,
    []
  );

  const renderActions = useCallback(
    ({ row, ActionsColumn }): JSX.Element => (
      <ActionsColumn items={tableActions(row as IRowData)} />
    ),
    [tableActions]
  );

  const emptyStateNoData = (
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
  );

  const pageContent = (
    <>
      <PageSection variant={PageSectionVariants.light}>
        {pageTitleElement}
      </PageSection>
      <PageSection>
        <TableView
          ariaLabel={t("smartEventsTempDictionary:instance.instancesListTable")}
          actions={[
            {
              label: t("instance.createSEInstance"),
              onClick: (): void => setShowCreateInstance(true),
              isPrimary: true,
            },
          ]}
          columns={columnNames}
          data={bridgeListResponse?.items}
          emptyStateNoData={emptyStateNoData}
          emptyStateNoResults={
            emptyStateNoData
          } /** https://issues.redhat.com/browse/MGDOBR-1229 */
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
    </>
  );

  return (
    <>
      <CreateInstance
        isOpen={showCreateInstance}
        onClose={(): void => setShowCreateInstance((prev) => !prev)}
        getCloudProviders={getCloudProvidersWithRegions}
        getSchema={getSchema}
        createBridge={handleCreate}
      />
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
