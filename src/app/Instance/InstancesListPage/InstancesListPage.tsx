import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TableView, useTranslation } from "@rhoas/app-services-ui-components";
import {
  Drawer,
  DrawerContent,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { IAction, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import CreateInstance, {
  CreateInstanceProps,
} from "@app/Instance/CreateInstance/CreateInstance";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import { useGetBridgesApi } from "../../../hooks/useBridgesApi/useGetBridgesApi";
import {
  BridgeResponse,
  ManagedResourceStatus,
} from "@rhoas/smart-events-management-sdk";
import DeleteInstance from "@app/Instance/DeleteInstance/DeleteInstance";
import { canDeleteResource, canEditResource } from "@utils/resourceUtils";
import { ErrorWithDetail } from "../../../types/Error";
import SEStatusLabel from "@app/components/SEStatusLabel/SEStatusLabel";
import { useCreateBridgeApi } from "../../../hooks/useBridgesApi/useCreateBridgeApi";
import { useGetCloudProvidersWithRegionsApi } from "../../../hooks/useCloudProvidersApi/useGetProvidersWithRegionsApi";
import { renderCell, renderHeader, TableColumn } from "@utils/tableUtils";
import { EmptyStateNoData } from "@app/components/EmptyState/EmptyStateNoData";
import { EmptyStateNoResults } from "@app/components/EmptyState/EmptyStateNoResults";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { useTablePageParams } from "../../../hooks/useTablePageParams/useTablePageParams";

const InstancesListPage = (): JSX.Element => {
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

  const triggerGetBridges = useCallback((): void => {
    getBridges(nameSearchParam, page, perPage, statuses, true);
  }, [getBridges, page, perPage, statuses, nameSearchParam]);

  usePolling(() => triggerGetBridges(), 10000);

  useEffect(() => {
    getBridges(nameSearchParam, page, perPage, statuses);
  }, [getBridges, page, perPage, statuses, nameSearchParam]);

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

  const onCreateBridge = useCallback(() => {
    setShowCreateInstance(false);
    getBridges(nameSearchParam, page, perPage, statuses);
  }, [getBridges, nameSearchParam, page, perPage, statuses]);

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
    getBridges(nameSearchParam, page, perPage, statuses);
    resetDeleteInstance();
  }, [
    getBridges,
    nameSearchParam,
    page,
    perPage,
    resetDeleteInstance,
    statuses,
  ]);

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

  const onCreateInstance = (): void => setShowCreateInstance(true);

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
              onClick: onCreateInstance,
              isPrimary: true,
            },
          ]}
          columns={columnNames}
          data={bridgeListResponse?.items}
          emptyStateNoData={
            <EmptyStateNoData
              title={t("instance.noInstances")}
              createButton={{
                title: t("instance.createSEInstance"),
                onCreate: onCreateInstance,
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
              title={t("instance.noInstances")}
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
            "smartEventsTempDictionary:instance.instancesListTable"
          )}
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
