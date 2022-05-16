import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { IRow, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  TableWithPagination,
} from "@app/components/TableWithPagination/TableWithPagination";
import CreateInstance from "@app/Instance/CreateInstance/CreateInstance";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import StatusLabel from "@app/components/StatusLabel/StatusLabel";
import { useGetBridgesApi } from "../../../hooks/useBridgesApi/useGetBridgesApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { TableWithPaginationSkeleton } from "@app/components/TableWithPaginationSkeleton/TableWithPaginationSkeleton";
import { useCreateBridgeApi } from "../../../hooks/useBridgesApi/useCreateBridgeApi";
import axios from "axios";
import { ResponseError } from "../../../types/Error";
import { BridgeResponse, ManagedResourceStatus } from "@openapi/generated";
import DeleteInstance from "@app/Instance/DeleteInstance/DeleteInstance";

const InstancesListPage = (): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [currentPageSize, setCurrentPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);
  const [totalRows, setTotalRows] = useState<number>();
  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<BridgeResponse>();

  const columnNames = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const bridgeId = (row as BridgeResponse)?.id ?? "";
        const status = (row as BridgeResponse)?.status;

        return status === ManagedResourceStatus.Ready ? (
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
      accessor: "status",
      label: t("common.status"),
      formatter: (value: IRowData): JSX.Element => {
        const statusString = (value as unknown as string) ?? "";
        return <StatusLabel status={statusString} />;
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
    }
  }, [bridgeListResponse]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const [showCreateInstance, setShowCreateInstance] = useState(false);
  const [newBridgeName, setNewBridgeName] = useState("");
  const [existingBridgeName, setExistingBridgeName] = useState("");

  const {
    error: createBridgeError,
    isLoading: createBridgeLoading,
    createBridge,
    bridge,
  } = useCreateBridgeApi();

  const handleCreateBridge = useCallback(
    (name: string) => {
      setNewBridgeName(name);
      createBridge({ name });
    },
    [createBridge]
  );

  useEffect(() => {
    if (bridge) {
      closeCreateInstanceDialog();
      getBridges(currentPage, currentPageSize);
    }
  }, [bridge, getBridges, currentPage, currentPageSize]);

  useEffect(() => {
    if (createBridgeError) {
      if (axios.isAxiosError(createBridgeError)) {
        // TODO: replace error code string with a value coming from an error catalog
        //  See https://issues.redhat.com/browse/MGDOBR-669 for more details.
        if (
          (createBridgeError.response?.data as ResponseError).code ===
          "OPENBRIDGE-1"
        ) {
          setExistingBridgeName(newBridgeName);
        }
      }
    }
  }, [createBridgeError, newBridgeName]);

  const closeCreateInstanceDialog = (): void => {
    setShowCreateInstance(false);
    setNewBridgeName("");
    setExistingBridgeName("");
  };

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

  const customToolbarElement = (
    <>
      <Button
        ouiaId="create-smart-event-instance"
        onClick={(): void => setShowCreateInstance(true)}
      >
        {t("instance.createSEInstance")}
      </Button>
      <CreateInstance
        isLoading={createBridgeLoading}
        isModalOpen={showCreateInstance}
        onClose={closeCreateInstanceDialog}
        onCreate={handleCreateBridge}
        existingInstanceName={existingBridgeName}
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
        <TextContent>
          <Text ouiaId="instances-page-title" component="h1">
            {t("openbridgeTempDictionary:instance.instancesListPageTitle")}
          </Text>
        </TextContent>
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
            onDetailsClick={(rowData): void => {
              setSelectedInstance(rowData as unknown as BridgeResponse);
              setShowInstanceDrawer(true);
            }}
            onDeleteClick={(rowData): void => {
              if (rowData) {
                const id = (rowData as unknown as BridgeResponse).id;
                const name = (rowData as unknown as BridgeResponse).name;
                if (id && name) {
                  deleteInstance(id, name);
                }
              }
            }}
            isLoading={isLoading}
            rows={bridgeListResponse.items}
            totalRows={totalRows ?? 0}
            pageNumber={currentPage}
            pageSize={currentPageSize}
            onPaginationChange={onPaginationChange}
            tableLabel={t(
              "openbridgeTempDictionary:instance.instancesListTable"
            )}
          >
            <EmptyState variant="large">
              <EmptyStateIcon icon={PlusCircleIcon} />
              <Title headingLevel="h4" size="lg">
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
