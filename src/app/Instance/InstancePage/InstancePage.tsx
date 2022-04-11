import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Label,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import { CaretDownIcon } from "@patternfly/react-icons";
import { TableWithPagination } from "@app/components/TableWithPagination/TableWithPagination";
import { IRow, IRowData } from "@patternfly/react-table";
import { Instance } from "../../../types/Instance";
import { formatDistance } from "date-fns";
import "./InstancePage.css";

type InstanceParams = {
  instanceId: string;
};

const InstancePage = () => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const { instanceId } = useParams<InstanceParams>();
  const location = useLocation();

  const processorsTabRef = React.createRef<HTMLElement>();
  const accessTabRef = React.createRef<HTMLElement>();

  const [activeTabKey, setActiveTabKey] = useState<number | string>(0);
  const [isDropdownActionOpen, setIsDropdownActionOpen] =
    useState<boolean>(false);

  const instanceName = `Instance ${instanceId}`; // @TODO retrieve it from API

  const handleTabClick = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string
  ) => {
    setActiveTabKey(eventKey);
  };

  const onDetailsClick = () =>
    // @TODO missing action to perform when clicking on details action
    {};

  const onDeleteClick = () =>
    // @TODO missing action to perform when clicking on delete action
    {};

  const processorsOverviewColumns = [
    {
      accessor: "name",
      label: t("common.name"),
      formatter: (value: IRowData, row?: IRow) => {
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
      formatter: (value: IRowData) => {
        const typeString = (value as unknown as string) ?? "";
        return (
          typeString.charAt(0).toUpperCase() + typeString.slice(1).toLowerCase()
        );
      },
    },
    {
      accessor: "status",
      label: t("common.status"),
      formatter: (value: IRowData) => {
        const statusString = (value as unknown as string) ?? "";
        return (
          <Label>
            {statusString.charAt(0).toUpperCase() +
              statusString.slice(1).toLowerCase()}
          </Label>
        );
      },
    },
    {
      accessor: "submitted_at",
      label: t("common.submittedAt"),
      formatter: (value: IRowData) => {
        const date = new Date(value as unknown as string);
        return formatDistance(date, new Date()) + " " + t("common.ago");
      },
    },
  ];

  const processorsOverviewRows = [
    {
      id: "da508471-ee0f-4f53-b574-da8a61285986",
      type: "source",
      name: "Organic pour-over",
      status: "accepted",
      submitted_at: "2022-02-24T13:34:00Z",
    },
    {
      id: "ab65ec62-1f23-4dd7-b106-e4158baf8228",
      type: "sink",
      name: "Processor ABC",
      status: "accepted",
      submitted_at: "2022-03-15T20:10:00Z",
    },
  ];

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter={true}>
          <StackItem>
            <Breadcrumb
              path={[
                { label: t("instance.smartEventInstances"), linkTo: "/" },
                { label: instanceName },
              ]}
            />
          </StackItem>
          <StackItem>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarItem alignment={{ default: "alignLeft" }}>
                  <TextContent>
                    <Text component="h1">{instanceName}</Text>
                  </TextContent>
                </ToolbarItem>
                <ToolbarItem alignment={{ default: "alignRight" }}>
                  <Dropdown
                    ouiaId="actions-dropdown"
                    onSelect={() => setIsDropdownActionOpen(false)}
                    toggle={
                      <DropdownToggle
                        ouiaId="actions-dropdown-toggle"
                        onToggle={(isOpen: boolean) =>
                          setIsDropdownActionOpen(isOpen)
                        }
                        toggleIndicator={CaretDownIcon}
                      >
                        {t("common.actions")}
                      </DropdownToggle>
                    }
                    isOpen={isDropdownActionOpen}
                    dropdownItems={[
                      <DropdownItem key="details" onClick={onDetailsClick}>
                        {t("common.details")}
                      </DropdownItem>,
                      <DropdownItem key="delete" onClick={onDeleteClick}>
                        {t("common.delete")}
                      </DropdownItem>,
                    ]}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </Toolbar>
          </StackItem>
        </Stack>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} type="tabs">
        <Tabs
          className="instance-page__tabs pf-u-pl-xl pf-u-pr-xl"
          activeKey={activeTabKey}
          onSelect={handleTabClick}
        >
          <Tab
            eventKey={0}
            tabContentId="instance-page__tabs-processors"
            tabContentRef={processorsTabRef}
            title={<TabTitleText>{t("common.processors")}</TabTitleText>}
          />
          <Tab
            eventKey={1}
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
          ref={processorsTabRef}
          aria-label="Processors tab"
        >
          <TableWithPagination
            columns={processorsOverviewColumns}
            customToolbarElement={
              <Link to={`${location.pathname}/create-processor`}>
                <Button variant="primary">
                  {t("processor.createProcessor")}
                </Button>
              </Link>
            }
            rows={processorsOverviewRows}
            tableLabel={t("openbridgeTempDictionary:processorsListTable")}
          />
        </TabContent>
        <TabContent
          eventKey={1}
          id="instance-page__tabs-access"
          ref={accessTabRef}
          aria-label="Access tab"
          hidden
        >
          Instance Access section
        </TabContent>
      </PageSection>
    </>
  );
};

export default InstancePage;
