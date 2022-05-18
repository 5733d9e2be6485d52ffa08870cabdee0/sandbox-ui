import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Drawer,
  DrawerContent,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  EmptyState,
  EmptyStateIcon,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { CaretDownIcon, PlusCircleIcon } from "@patternfly/react-icons";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  TableWithPagination,
} from "@app/components/TableWithPagination/TableWithPagination";
import { IRow, IRowData } from "@patternfly/react-table";
import { formatDistance } from "date-fns";
import "./InstancePage.css";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import StatusLabel from "@app/components/StatusLabel/StatusLabel";
import { useGetBridgeApi } from "../../../hooks/useBridgesApi/useGetBridgeApi";
import PageHeaderSkeleton from "@app/components/PageHeaderSkeleton/PageHeaderSkeleton";
import { TableWithPaginationSkeleton } from "@app/components/TableWithPaginationSkeleton/TableWithPaginationSkeleton";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { BridgeResponse } from "@openapi/generated";
import DeleteInstance from "@app/Instance/DeleteInstance/DeleteInstance";

interface InstanceRouteParams {
  instanceId: string;
}

const InstancePage = (): JSX.Element => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const location = useLocation();
  const history = useHistory();
  const goToHome = useCallback((): void => history.push(`/`), [history]);

  const processorsTabRef = React.createRef<HTMLElement>();

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [currentPageSize, setCurrentPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);
  const [totalRows, setTotalRows] = useState<number>();
  const [activeTabKey, setActiveTabKey] = useState<number | string>(0);
  const [isDropdownActionOpen, setIsDropdownActionOpen] =
    useState<boolean>(false);
  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);

  const {
    getBridge,
    bridge,
    isLoading: isBridgeLoading,
    error: bridgeError,
  } = useGetBridgeApi();

  useEffect(() => {
    getBridge(instanceId);
  }, [getBridge, instanceId]);

  const {
    getProcessors,
    processorListResponse,
    isLoading: areProcessorsLoading,
    error: processorsError,
  } = useGetProcessorsApi();

  const triggerGetProcessors = useCallback(
    (): void => getProcessors(instanceId, currentPage, currentPageSize, true),
    [currentPage, currentPageSize, getProcessors, instanceId]
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
    if (bridgeError) {
      console.error(bridgeError);
      goToHome();
    }

    if (processorsError) {
      console.error(processorsError);
    }
  }, [bridgeError, goToHome, processorsError]);

  const handleTabClick = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string
  ): void => {
    setActiveTabKey(eventKey);
  };

  const processorsOverviewColumns = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const processorId = (row as BridgeResponse)?.id ?? "";
        return (
          <Link
            data-testid="tableProcessors-linkProcessor"
            to={`${location.pathname}/processor/${processorId}`}
          >
            {value}
          </Link>
        );
      },
    },
    { accessor: "id", label: t("common.id") },
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

  const customToolbarElement = (
    <Link to={`${location.pathname}/create-processor`}>
      <Button ouiaId="create-processor" variant="primary">
        {t("processor.createProcessor")}
      </Button>
    </Link>
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteInstance = (): void => {
    setShowDeleteModal(true);
  };

  const handleOnDeleteSuccess = useCallback((): void => {
    setShowDeleteModal(false);
    history.push(`/`);
  }, [history]);

  return (
    <>
      {(isBridgeLoading ||
        (totalRows === undefined && areProcessorsLoading)) && (
        <>
          <PageHeaderSkeleton
            pageTitle={t("instance.loadingInstance")}
            hasActionDropdown={true}
            hasLabel={false}
            totalTabs={1}
          />
          <PageSection>
            <TabContent id="instance-skeleton__page__tabs-processors">
              <TableWithPaginationSkeleton
                hasActionColumn={true}
                columns={processorsOverviewColumns}
                totalRows={currentPageSize}
                customToolbarElement={customToolbarElement}
              />
            </TabContent>
          </PageSection>
        </>
      )}
      {bridge && processorListResponse?.items && (
        <>
          <Drawer isExpanded={showInstanceDrawer}>
            <DrawerContent
              data-ouia-component-id="instance-drawer"
              panelContent={
                <InstanceDetails
                  onClosingDetails={(): void => setShowInstanceDrawer(false)}
                  instance={bridge}
                />
              }
            >
              <PageSection
                variant={PageSectionVariants.light}
                type="breadcrumb"
              >
                <Breadcrumb
                  path={[
                    { label: t("instance.smartEventInstances"), linkTo: "/" },
                    { label: bridge.name ?? "" },
                  ]}
                />
              </PageSection>
              <PageSection variant={PageSectionVariants.light}>
                <Split>
                  <SplitItem isFilled>
                    <TextContent>
                      <Text ouiaId="instance-name" component="h1">
                        {bridge.name}
                      </Text>
                    </TextContent>
                  </SplitItem>
                  <SplitItem>
                    <Dropdown
                      ouiaId="actions"
                      onSelect={(): void => setIsDropdownActionOpen(false)}
                      toggle={
                        <DropdownToggle
                          ouiaId="actions"
                          onToggle={(isOpen: boolean): void =>
                            setIsDropdownActionOpen(isOpen)
                          }
                          toggleIndicator={CaretDownIcon}
                        >
                          {t("common.actions")}
                        </DropdownToggle>
                      }
                      isOpen={isDropdownActionOpen}
                      dropdownItems={[
                        <DropdownItem
                          key="details"
                          ouiaId="details"
                          onClick={(): void => {
                            setShowInstanceDrawer(true);
                          }}
                        >
                          {t("common.details")}
                        </DropdownItem>,
                        <DropdownItem
                          key="delete"
                          ouiaId="delete"
                          onClick={deleteInstance}
                          isDisabled={!(bridge && processorListResponse)}
                        >
                          {t("common.delete")}
                        </DropdownItem>,
                      ]}
                    />
                  </SplitItem>
                </Split>
              </PageSection>
              <PageSection variant={PageSectionVariants.light} type="tabs">
                <Tabs
                  className="instance-page__tabs"
                  ouiaId="instance-details"
                  usePageInsets
                  activeKey={activeTabKey}
                  onSelect={handleTabClick}
                >
                  <Tab
                    eventKey={0}
                    ouiaId="processors"
                    tabContentId="instance-page__tabs-processors"
                    tabContentRef={processorsTabRef}
                    title={
                      <TabTitleText>{t("common.processors")}</TabTitleText>
                    }
                  />
                </Tabs>
              </PageSection>
              <PageSection>
                <TabContent
                  eventKey={0}
                  id="instance-page__tabs-processors"
                  ouiaId="processors"
                  ref={processorsTabRef}
                  aria-label="Processors tab"
                >
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
                  >
                    <EmptyState variant="large">
                      <EmptyStateIcon icon={PlusCircleIcon} />
                      <Title headingLevel="h4" size="lg">
                        {t("processor.noProcessors")}
                      </Title>
                    </EmptyState>
                  </TableWithPagination>
                </TabContent>
              </PageSection>
            </DrawerContent>
          </Drawer>
          <DeleteInstance
            instanceId={bridge.id}
            instanceName={bridge.name}
            showDeleteModal={showDeleteModal}
            onCanceled={(): void => setShowDeleteModal(false)}
            onDeleted={handleOnDeleteSuccess}
          />
        </>
      )}
    </>
  );
};

export default InstancePage;
