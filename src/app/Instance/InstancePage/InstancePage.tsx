import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Label,
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
import { TableWithPagination } from "@app/components/TableWithPagination/TableWithPagination";
import { IRow, IRowData } from "@patternfly/react-table";
import { Instance } from "../../../types/Instance";
import { formatDistance } from "date-fns";
import "./InstancePage.css";

const InstancePage = (): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const location = useLocation();
  const history = useHistory();

  const processorsTabRef = React.createRef<HTMLElement>();
  const accessTabRef = React.createRef<HTMLElement>();

  const [activeTabKey, setActiveTabKey] = useState<number | string>(0);
  const [isDropdownActionOpen, setIsDropdownActionOpen] =
    useState<boolean>(false);

  const instanceName = `My instance`; // @TODO retrieve it from API

  const handleTabClick = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string
  ): void => {
    setActiveTabKey(eventKey);
  };

  const onDetailsClick = (): void =>
    // @TODO missing action to perform when clicking on details action
    {};

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
        const statusString = value as unknown as string;
        const label =
          !statusString || !statusString.length
            ? ""
            : statusString.charAt(0).toUpperCase() +
              statusString.slice(1).toLowerCase();
        return <Label>{label}</Label>;
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
              <Text component="h1">{instanceName}</Text>
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
                <DropdownItem key="details" onClick={onDetailsClick}>
                  {t("common.details")}
                </DropdownItem>,
                <DropdownItem key="delete" onClick={onDeleteClick}>
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
                <Button ouiaId="create-processor-instance" variant="primary">
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
