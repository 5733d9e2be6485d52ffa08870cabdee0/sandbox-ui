import React, { useEffect, useState } from "react";
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
  Skeleton,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { IRow, IRowData } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Instance } from "../../../types/Instance";
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

const InstancesListPage = (): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [currentPageSize, setCurrentPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);
  const [totalRows, setTotalRows] = useState<number>(DEFAULT_PAGE_SIZE);
  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<Instance>();

  const columnNames = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const bridgeId = (row as Instance)?.id;
        return (
          <Link
            data-testid="tableInstances-linkInstance"
            to={`/instance/${bridgeId}`}
          >
            {value}
          </Link>
        );
      },
    },
    { accessor: "description", label: t("common.description") },
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

  usePolling(() => getBridges(currentPage, currentPageSize), 10000);

  useEffect(() => {
    getBridges(FIRST_PAGE, DEFAULT_PAGE_SIZE);
  }, [getBridges]);

  useEffect(() => {
    if (bridgeListResponse) {
      setCurrentPageSize(bridgeListResponse.size ?? DEFAULT_PAGE_SIZE);
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

  const pageContent = (
    <>
      {isLoading && <Skeleton />}
      {!isLoading && bridgeListResponse?.items && (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">
                {t("openbridgeTempDictionary:instance.instancesListPageTitle")}
              </Text>
            </TextContent>
          </PageSection>
          <PageSection>
            <TableWithPagination
              columns={columnNames}
              customToolbarElement={
                <React.Fragment>
                  <Button
                    ouiaId="create-smart-event-instance"
                    onClick={(): void => setShowCreateInstance(true)}
                  >
                    {t("instance.createSEInstance")}
                  </Button>
                  <CreateInstance
                    isLoading={false}
                    isModalOpen={showCreateInstance}
                    onClose={(): void => setShowCreateInstance(false)}
                    onCreate={(): void => setShowCreateInstance(false)}
                  />
                </React.Fragment>
              }
              onDetailsClick={(rowData): void => {
                setSelectedInstance(rowData as unknown as Instance);
                setShowInstanceDrawer(true);
              }}
              rows={bridgeListResponse.items}
              totalRows={totalRows}
              pageNumber={currentPage}
              pageSize={currentPageSize}
              onPaginationChange={(pageNumber, pageSize): void => {
                getBridges(
                  pageSize === currentPageSize ? pageNumber : FIRST_PAGE,
                  pageSize
                );
              }}
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
          </PageSection>
        </>
      )}
    </>
  );

  return selectedInstance ? (
    <Drawer isExpanded={showInstanceDrawer}>
      <DrawerContent
        data-ouia-component-id="instance-drawer"
        panelContent={
          <InstanceDetails
            onClosingDetails={(): void => setShowInstanceDrawer(false)}
            instance={selectedInstance}
          />
        }
      >
        {pageContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <>{pageContent}</>
  );
};

export default InstancesListPage;
