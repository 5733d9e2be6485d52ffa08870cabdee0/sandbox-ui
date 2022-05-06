import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Drawer,
  DrawerContent,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Text,
  TextContent,
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

  const { bridges, isLoading, getBridges, error } = useGetBridgesApi();

  const callGetBridges = useCallback(() => {
    getBridges(currentPage, currentPageSize)
      .then((result) => {
        if (result) {
          setCurrentPageSize(result.size);
          setCurrentPage(result.page);
          setTotalRows(result.total);
        }
      })
      .catch((error) => console.error(error));
  }, [currentPage, currentPageSize, getBridges]);

  usePolling(() => callGetBridges(), 10000);

  useEffect(() => {
    callGetBridges();
  }, [callGetBridges]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const [showCreateInstance, setShowCreateInstance] = useState(false);

  const pageContent = (
    <>
      {isLoading && <Skeleton />}
      {bridges && (
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
              rows={bridges}
              totalRows={totalRows}
              pageNumber={currentPage}
              pageSize={currentPageSize}
              onPaginationChange={(pageNumber, pageSize): void => {
                setCurrentPage(
                  pageSize === currentPageSize ? pageNumber : FIRST_PAGE
                );
                setCurrentPageSize(pageSize);
              }}
              tableLabel={t(
                "openbridgeTempDictionary:instance.instancesListTable"
              )}
            />
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
