import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerContent,
  Dropdown,
  DropdownItem,
  DropdownToggle,
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
} from "@patternfly/react-core";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { CaretDownIcon } from "@patternfly/react-icons";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  TableWithPagination,
} from "@app/components/TableWithPagination/TableWithPagination";
import { IRow, IRowData } from "@patternfly/react-table";
import { Instance } from "../../../types/Instance";
import { formatDistance } from "date-fns";
import "./InstancePage.css";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import StatusLabel from "@app/components/StatusLabel/StatusLabel";

const InstancePage = (): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const location = useLocation();
  const history = useHistory();

  const processorsTabRef = React.createRef<HTMLElement>();
  const accessTabRef = React.createRef<HTMLElement>();

  const [activeTabKey, setActiveTabKey] = useState<number | string>(0);
  const [isDropdownActionOpen, setIsDropdownActionOpen] =
    useState<boolean>(false);
  const [showInstanceDrawer, setShowInstanceDrawer] = useState<boolean>(false);

  const instanceName = `Instance one`; // @TODO retrieve it from API

  const handleTabClick = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string
  ): void => {
    setActiveTabKey(eventKey);
  };

  const onDeleteClick = (): void =>
    // @TODO missing action to perform when clicking on delete action
    {
      history.push(`/`);
    };

  const processorsOverviewColumns = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow): JSX.Element => {
        const processorId = (row as Instance)?.id;
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

  const processorsOverviewRows = [
    {
      id: "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
      type: "sink",
      name: "Processor one",
      status: "ready",
      submitted_at: "2022-03-15T20:10:00Z",
    },
    {
      id: "f8f34af4-caed-11ec-9d64-0242ac120002",
      type: "source",
      name: "Processor three",
      status: "accepted",
      submitted_at: "2022-04-15T12:10:46Z",
    },
  ];

  return (
    <Drawer isExpanded={showInstanceDrawer}>
      <DrawerContent
        data-ouia-component-id="instance-drawer"
        panelContent={
          <InstanceDetails
            onClosingDetails={(): void => setShowInstanceDrawer(false)}
            instance={{
              id: "3543edaa-1851-4ad7-96be-ebde7d20d717",
              endpoint:
                "https://ob-3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
              name: instanceName,
              owner: "bebianco@redhat.com",
              published_at: "2022-04-12T12:06:22.881959+0000",
              status: "READY",
              submitted_at: "2022-04-12T12:04:43.044590+0000",
            }}
          />
        }
      >
        <PageSection variant={PageSectionVariants.light} type="breadcrumb">
          <Breadcrumb
            path={[
              { label: t("instance.smartEventInstances"), linkTo: "/" },
              { label: instanceName },
            ]}
          />
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Split>
            <SplitItem isFilled>
              <TextContent>
                <Text ouiaId="instance-name" component="h1">
                  {instanceName}
                </Text>
              </TextContent>
            </SplitItem>
            <SplitItem>
              <Dropdown
                ouiaId="actions-dropdown"
                onSelect={(): void => setIsDropdownActionOpen(false)}
                toggle={
                  <DropdownToggle
                    ouiaId="actions-dropdown-toggle"
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
                    ouiaId="action-details"
                    onClick={(): void => {
                      setShowInstanceDrawer(true);
                    }}
                  >
                    {t("common.details")}
                  </DropdownItem>,
                  <DropdownItem
                    key="delete"
                    ouiaId="action-delete"
                    onClick={onDeleteClick}
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
            usePageInsets
            activeKey={activeTabKey}
            onSelect={handleTabClick}
          >
            <Tab
              eventKey={0}
              ouiaId="processors-overview"
              tabContentId="instance-page__tabs-processors"
              tabContentRef={processorsTabRef}
              title={<TabTitleText>{t("common.processors")}</TabTitleText>}
            />
            <Tab
              eventKey={1}
              ouiaId="access-overview"
              tabContentId="instance-page__tabs-access"
              tabContentRef={accessTabRef}
              title={<TabTitleText>{t("common.access")}</TabTitleText>}
            />
          </Tabs>
        </PageSection>
        <PageSection>
          <TabContent
            eventKey={0}
            id="instance-page__tabs-processors"
            ouiaId="processors-content"
            ref={processorsTabRef}
            aria-label="Processors tab"
          >
            <TableWithPagination
              columns={processorsOverviewColumns}
              customToolbarElement={
                <Link to={`${location.pathname}/create-processor`}>
                  <Button ouiaId="create-processor-instance" variant="primary">
                    {t("processor.createProcessor")}
                  </Button>
                </Link>
              }
              rows={processorsOverviewRows}
              tableLabel={t(
                "openbridgeTempDictionary:processor.processorsListTable"
              )}
              onPaginationChange={(): void => {}} // @TODO MGDOBR-673
              pageNumber={FIRST_PAGE} // @TODO MGDOBR-673
              pageSize={DEFAULT_PAGE_SIZE} // @TODO MGDOBR-673
              totalRows={DEFAULT_PAGE_SIZE} // @TODO MGDOBR-673
            />
          </TabContent>
          <TabContent
            eventKey={1}
            id="instance-page__tabs-access"
            ouiaId="access-content"
            ref={accessTabRef}
            aria-label="Access tab"
            hidden
          >
            Instance Access section
          </TabContent>
        </PageSection>
      </DrawerContent>
    </Drawer>
  );
};

export default InstancePage;
